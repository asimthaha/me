import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EMAILJS_SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID');
const EMAILJS_TEMPLATE_ID = Deno.env.get('EMAILJS_TEMPLATE_ID');
const EMAILJS_TEMPLATE_USER_ID = Deno.env.get('EMAILJS_TEMPLATE_USER_ID');
const EMAILJS_PUBLIC_KEY = Deno.env.get('EMAILJS_PUBLIC_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ContactFormData {
  name?: string;
  email?: string;
  message?: string;
}

// Validation functions
function validateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }
  return { valid: true };
}

function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!trimmed) {
    return { valid: false, error: "Email address is required" };
  }
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please provide a valid email address" };
  }
  if (trimmed.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }
  return { valid: true };
}

function validateMessage(message: string): { valid: boolean; error?: string } {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length < 10) {
    return { valid: false, error: "Message must be at least 10 characters long" };
  }
  if (trimmed.length > 1000) {
    return { valid: false, error: "Message must be less than 1000 characters" };
  }
  // Enhanced spam detection
  const spamPatterns = [
    'http://', 'https://', 'www.', 'click here', 'buy now', 'casino', 
    'viagra', 'lottery', 'winner', 'congratulations', 'claim now',
    'limited time', 'act now', 'free money', 'make money fast'
  ];
  const lowerMessage = trimmed.toLowerCase();
  if (spamPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { valid: false, error: "Message contains prohibited content" };
  }
  
  // Check for excessive special characters (potential spam)
  const specialCharsCount = (trimmed.match(/[!@#$%^&*()]/g) || []).length;
  if (specialCharsCount > 10) {
    return { valid: false, error: "Message contains too many special characters" };
  }
  
  return { valid: true };
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Check for duplicate submissions
async function checkDuplicateSubmission(email: string, message: string): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id')
    .eq('email', email)
    .eq('message', message)
    .gte('created_at', fiveMinutesAgo)
    .limit(1);

  if (error) {
    console.error('Error checking duplicates:', error);
    return false; // Allow submission on error
  }

  return data && data.length > 0;
}

// Save contact submission to Supabase
async function saveContactSubmission(data: ContactFormData, clientIp: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: sanitizeInput(data.name!),
      email: sanitizeInput(data.email!),
      message: sanitizeInput(data.message!),
      ip_address: clientIp,
      user_agent: 'Chatbot',
      status: 'new'
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to save contact submission');
  }

  return submission;
}

// Send emails via EmailJS
async function sendContactEmails(data: ContactFormData, submissionId: string) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured, skipping email send');
    return;
  }

  const emailJSUrl = 'https://api.emailjs.com/api/v1.0/email/send';

  // Send admin notification
  const adminEmailPromise = fetch(emailJSUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: sanitizeInput(data.name!),
        from_email: sanitizeInput(data.email!),
        message: sanitizeInput(data.message!),
        submission_id: submissionId,
        submitted_at: new Date().toISOString()
      }
    })
  });

  // Send user confirmation
  const userEmailPromise = fetch(emailJSUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_USER_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_name: sanitizeInput(data.name!),
        to_email: sanitizeInput(data.email!),
        message: sanitizeInput(data.message!)
      }
    })
  });

  try {
    await Promise.all([adminEmailPromise, userEmailPromise]);
    console.log('Emails sent successfully');
  } catch (error) {
    console.error('EmailJS error:', error);
    // Don't throw - submission was saved, email is secondary
  }
}

// Rate limiting for contact submissions
const contactRateLimiter = new Map<string, { count: number; resetTime: number }>();
const CONTACT_RATE_LIMIT = 3; // Max 3 contact submissions per hour
const CONTACT_RATE_WINDOW = 3600000; // 1 hour

function checkContactRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const limit = contactRateLimiter.get(clientIp);

  if (limit) {
    if (now < limit.resetTime) {
      return limit.count < CONTACT_RATE_LIMIT;
    } else {
      contactRateLimiter.delete(clientIp);
    }
  }
  return true;
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

    const { messages, knowledgeBase, contactFormData } = await req.json();

    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not configured');
    }

    console.log('Received chat request with', messages.length, 'messages');

    // Handle contact form submission if all data is collected
    if (contactFormData && contactFormData.name && contactFormData.email && contactFormData.message) {
      // Validate all fields
      const nameValidation = validateName(contactFormData.name);
      const emailValidation = validateEmail(contactFormData.email);
      const messageValidation = validateMessage(contactFormData.message);

      if (!nameValidation.valid || !emailValidation.valid || !messageValidation.valid) {
        const errors = [
          !nameValidation.valid && nameValidation.error,
          !emailValidation.valid && emailValidation.error,
          !messageValidation.valid && messageValidation.error
        ].filter(Boolean);

        return new Response(
          JSON.stringify({ 
            error: 'Validation failed',
            validationErrors: errors,
            message: `Please correct the following: ${errors.join(', ')}`
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check rate limit
      if (!checkContactRateLimit(clientIp)) {
        return new Response(
          JSON.stringify({ 
            error: "You've reached the maximum number of contact submissions. Please try again in an hour.",
            retryAfter: 3600
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check for duplicate submission
      const isDuplicate = await checkDuplicateSubmission(
        contactFormData.email,
        contactFormData.message
      );
      
      if (isDuplicate) {
        return new Response(
          JSON.stringify({ 
            error: "This message was already submitted recently. Please wait a few minutes before submitting again."
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Save to database and send emails
      try {
        const submission = await saveContactSubmission(contactFormData, clientIp);
        await sendContactEmails(contactFormData, submission.id);

        // Update rate limiter
        const now = Date.now();
        const limit = contactRateLimiter.get(clientIp);
        if (limit && now < limit.resetTime) {
          limit.count++;
        } else {
          contactRateLimiter.set(clientIp, { count: 1, resetTime: now + CONTACT_RATE_WINDOW });
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Thank you! Your message has been sent successfully. I'll get back to you soon!"
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (error) {
        console.error('Contact submission error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to submit contact form. Please try again.'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

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

CONTACT FORM CAPABILITY:
You can help users send contact messages directly through this chat. When a user wants to get in touch, contact, send a message, or ask about availability:

1. Warmly acknowledge their interest and explain the process
2. Collect their name (2-100 characters, letters, spaces, hyphens, and apostrophes only)
3. Collect their email (valid email format, will be used for response)
4. Collect their message (10-1000 characters, no URLs or promotional content)

VALIDATION RULES:
- Name: Must be 2-100 characters with only letters, spaces, hyphens, and apostrophes
- Email: Must be a valid email address format
- Message: Must be 10-1000 characters, no URLs, no excessive special characters

After collecting all information:
- Show a clear summary of their information
- Ask for explicit confirmation ("Please type 'yes' to confirm and send your message")
- Only submit when user confirms with "yes", "confirm", "send", or similar affirmative response
- Allow user to cancel by typing "cancel", "no", or "stop"

Use natural, conversational language. Validate each field as you collect it and provide specific, friendly error messages if validation fails. Guide users to correct any errors before moving to the next field.

GUIDELINES:
- Be professional yet personable
- Provide accurate information only from the knowledge base above
- Keep responses concise (2-4 sentences)
- If you don't know something, suggest contacting directly
- Direct users to relevant portfolio sections when appropriate
- Help users send contact messages through the chat interface`;

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
