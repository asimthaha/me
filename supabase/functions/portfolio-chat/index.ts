import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simple in-memory rate limiter
// In production, consider using Redis or Supabase for distributed rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 10; // Max requests per window
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimiter.entries()) {
    if (now > value.resetTime) {
      rateLimiter.delete(key);
    }
  }
}, 300000);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const now = Date.now();
    const limit = rateLimiter.get(clientIp);

    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= RATE_LIMIT_REQUESTS) {
          console.warn(`Rate limit exceeded for IP: ${clientIp}`);
          return new Response(
            JSON.stringify({ 
              error: "Rate limit exceeded. Please try again in a minute.",
              retryAfter: Math.ceil((limit.resetTime - now) / 1000)
            }),
            { 
              status: 429, 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil((limit.resetTime - now) / 1000))
              } 
            }
          );
        }
        limit.count++;
      } else {
        // Reset window
        rateLimiter.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      // First request from this IP
      rateLimiter.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const { messages, knowledgeBase } = await req.json();

    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not configured');
    }

    console.log('Received chat request with', messages.length, 'messages');

    // Create system prompt with knowledge base
    const systemPrompt = `You are an AI assistant for ${knowledgeBase.personal.name}'s professional portfolio website.

ABOUT ${knowledgeBase.personal.name.toUpperCase()}:
- Title: ${knowledgeBase.personal.title}
- Experience: ${knowledgeBase.personal.yearsOfExperience} year(s)
- Availability: ${knowledgeBase.personal.availability.status}

SPECIALIZATIONS:
${knowledgeBase.personal.specializations.map((s: string) => `- ${s}`).join('\n')}

SKILLS:
${JSON.stringify(knowledgeBase.skills, null, 2)}

PROJECTS:
${JSON.stringify(knowledgeBase.projects, null, 2)}

SERVICES:
${JSON.stringify(knowledgeBase.services, null, 2)}

GUIDELINES:
- Be professional yet personable
- Provide accurate information only from the knowledge base above
- Keep responses concise (2-4 sentences)
- If you don't know something, suggest contacting directly
- Direct users to relevant portfolio sections when appropriate`;

    // Format messages for Gemini API
    const formattedMessages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...messages.map((msg: Message) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    // Call Google Gemini API with streaming
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    console.log('Streaming response from Gemini API');

    // Return the streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
