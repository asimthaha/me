import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateKnowledgeBase } from "@/lib/chatbot-knowledge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const SUGGESTED_QUESTIONS = [
  "What technologies do you specialize in?",
  "Tell me about your recent projects",
  "What services do you offer?",
  "Are you available for new projects?",
];

const MAX_RETRIES = 3;
const CHAT_STORAGE_KEY = "portfolio_chat_history";

export const PortfolioChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open (only if no saved history)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm here to answer questions about my skills, projects, and services. What would you like to know?",
          id: "welcome",
        },
      ]);
    }
  }, [isOpen]);

  // Focus management - focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close chat
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      // Ctrl+/ to toggle chat
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Announce new messages to screen readers
  useEffect(() => {
    if (messages.length > 0 && liveRegionRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.content) {
        liveRegionRef.current.textContent = `Assistant: ${lastMessage.content}`;
      }
    }
  }, [messages]);

  // Memoize knowledge base generation (only regenerate if data changes)
  const knowledgeBase = useMemo(() => generateKnowledgeBase(), []);

  const clearChatHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
    // Show welcome message after clearing
    setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm here to answer questions about my skills, projects, and services. What would you like to know?",
          id: "welcome",
        },
      ]);
    }, 100);
  }, []);

  const hideChatIcon = () => {
    setIsHidden(true);
    setIsOpen(false);
  };

  const sendMessageWithRetry = async (attempt: number = 0): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };

    if (attempt === 0) {
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setRetryCount(0);
    }

    try {
      const response = await fetch(
        `https://efznnmazwqlkaxcsgoqy.supabase.co/functions/v1/portfolio-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
            }`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            knowledgeBase,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${errorData.error || "Rate limit exceeded. Please wait a minute before trying again."}`,
              id: Date.now().toString(),
            },
          ]);
          setIsLoading(false);
          setRetryCount(0);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle the response as a JSON array of chunks
      const responseData = await response.json();
      console.log("Received response data:", responseData);
      console.log("Response data type:", typeof responseData);
      console.log("Is array:", Array.isArray(responseData));

      let assistantMessage = "";
      const assistantMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          id: assistantMsgId,
        },
      ]);

      // Token batching for smoother rendering
      let tokenBuffer = "";
      let lastUpdateTime = Date.now();
      const BATCH_INTERVAL = 100; // Update UI every 100ms instead of per token

      const flushBuffer = () => {
        if (tokenBuffer) {
          assistantMessage += tokenBuffer;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: assistantMessage }
                : m
            )
          );
          tokenBuffer = "";
        }
      };

      try {
        // Process each chunk in the array
        if (Array.isArray(responseData)) {
          console.log(
            "Processing array of chunks, length:",
            responseData.length
          );
          for (const chunk of responseData) {
            console.log("Processing chunk:", chunk);
            const content = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              tokenBuffer += content;
              
              // Batch updates to reduce re-renders
              const now = Date.now();
              if (now - lastUpdateTime >= BATCH_INTERVAL) {
                flushBuffer();
                lastUpdateTime = now;
              }
            }
          }
          // Flush any remaining tokens
          flushBuffer();
        } else {
          // Fallback for single response object
          console.log(
            "Response is not an array, falling back to single object parsing"
          );
          const content =
            responseData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            assistantMessage = content;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: assistantMessage }
                  : m
              )
            );
          }
        }
      } catch (processingError) {
        console.error("Error processing response data:", processingError);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble processing the response. Please try again.",
            id: Date.now().toString(),
          },
        ]);
      }

      setRetryCount(0);
      setIsLoading(false);
    } catch (error) {
      console.error("Chat error (attempt " + (attempt + 1) + "):", error);

      if (attempt < MAX_RETRIES - 1) {
        const delay = 1000 * Math.pow(2, attempt);
        setRetryCount(attempt + 1);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendMessageWithRetry(attempt + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having persistent connection issues. Please try again later or reach out directly via the contact form.",
            id: Date.now().toString(),
          },
        ]);
        setIsLoading(false);
        setRetryCount(0);
      }
    }
  };

  const sendMessage = () => sendMessageWithRetry();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = useCallback((question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  }, []);

  return (
    <>
      {/* Screen reader announcements */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Floating Chat Button */}
      {!isHidden && (
        <div className="fixed bottom-24 right-4 md:bottom-6 z-50 group">
          <Button
            onClick={hideChatIcon}
            className={cn(
              "absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-10",
              "bg-accent text-accent-foreground hover:bg-accent/90",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              isOpen && "scale-0",
              isMobile && "opacity-0"
            )}
            aria-label="Hide chat icon permanently"
            size="sm"
          >
            <X className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
          </Button>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg",
              "bg-accent text-accent-foreground hover:bg-accent/90",
              "hover:scale-110 transition-all duration-200",
              isOpen && "scale-0"
            )}
            aria-label="Open portfolio chat assistant"
            aria-expanded={isOpen}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      <Card
        role="dialog"
        aria-label="Portfolio chat assistant"
        aria-modal="true"
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[600px] z-50",
          "flex flex-col shadow-2xl transition-all duration-300",
          "md:w-[420px] md:h-[650px]",
          "bg-card border-border",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">
              Portfolio Assistant
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChatHistory}
              aria-label="Clear chat history"
              title="Clear chat history"
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea
          className="flex-1 p-4"
          role="log"
          aria-label="Chat messages"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  role="article"
                  aria-label={`${
                    message.role === "user"
                      ? "Your message"
                      : "Assistant message"
                  }`}
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 text-left whitespace-normal"
                    onClick={() => handleSuggestionClick(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  {retryCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Retrying ({retryCount}/{MAX_RETRIES})...
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-background border-input"
              aria-label="Type your message"
              aria-describedby="chat-disclaimer"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p
            id="chat-disclaimer"
            className="text-xs text-muted-foreground mt-2"
          >
            AI-powered · Press Esc to close · Ctrl+/ to toggle
          </p>
        </div>
      </Card>
    </>
  );
};
