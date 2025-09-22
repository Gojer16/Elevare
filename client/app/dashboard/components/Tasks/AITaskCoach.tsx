"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, X, Lightbulb, Target, Brain } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
}

interface AITaskCoachProps {
  onTaskSuggestion?: (taskTitle: string, description?: string) => void;
}

const quickPrompts = [
  { icon: Target, text: "What should I focus on today?", category: "focus" },
  { icon: Brain, text: "I'm feeling overwhelmed, help me prioritize", category: "overwhelm" },
  { icon: Lightbulb, text: "I have many ideas but can't choose one", category: "decision" },
  { icon: Sparkles, text: "Help me find my most important task", category: "importance" }
];

const welcomeMessages = [
  "Hey! Need help figuring out your ONE thing today? 🎯",
  "Feeling stuck? Let's discover what deserves your focus today! ✨",
  "Not sure what to tackle? I'm here to help you find clarity! 💡",
  "Let's find that one task that will make today meaningful! 🌟"
];

export function AITaskCoach({ onTaskSuggestion }: AITaskCoachProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasInteracted) {
      // Add welcome message when first opened
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        role: "ai",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setHasInteracted(true);
    }
  }, [isOpen, hasInteracted]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: textToSend,
          context: "task_planning",
          conversationHistory: messages.slice(-3) // Send last 3 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if AI suggested a specific task
      if (data.suggestedTask) {
        setTimeout(() => {
          if (onTaskSuggestion) {
            onTaskSuggestion(data.suggestedTask.title, data.suggestedTask.description);
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Try asking: 'What should I focus on today?' or 'Help me prioritize my tasks.'",
        role: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      {/* Floating Coach Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-full mt-6 p-4 bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 
                       hover:from-[var(--color-secondary)]/20 hover:to-[var(--color-primary)]/20
                       border-2 border-dashed border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)]/50
                       rounded-2xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="p-2 bg-[var(--color-secondary)]/20 rounded-full"
              >
                <MessageCircle className="w-5 h-5 text-[var(--color-secondary)]" />
              </motion.div>
              <div className="text-left">
                <div className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-secondary)] transition-colors">
                  Need help finding your ONE thing?
                </div>
                <div className="text-sm text-[var(--color-foreground)]/60">
                  Ask your AI coach for guidance
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-[var(--color-secondary)] opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-secondary)]/20 rounded-full">
                  <MessageCircle className="w-5 h-5 text-[var(--color-secondary)]" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-foreground)]">AI Task Coach</div>
                  <div className="text-xs text-[var(--color-foreground)]/60">Here to help you focus</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--color-foreground)]/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[var(--color-foreground)]/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[var(--color-secondary)] text-white rounded-br-none"
                          : "bg-[var(--color-foreground)]/10 text-[var(--color-foreground)] rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[var(--color-foreground)]/10 text-[var(--color-foreground)] rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3">
                <div className="text-xs text-[var(--color-foreground)]/60 mb-2">Quick questions:</div>
                <div className="grid grid-cols-1 gap-2">
                  {quickPrompts.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="flex items-center gap-2 p-2 text-left text-sm rounded-lg 
                                   hover:bg-[var(--color-secondary)]/10 transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-[var(--color-secondary)] opacity-60 group-hover:opacity-100" />
                        <span className="text-[var(--color-foreground)]/80 group-hover:text-[var(--color-foreground)]">
                          {prompt.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[var(--border-color)] p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your tasks..."
                  className="flex-1 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                             focus:border-[var(--color-secondary)] transition-all duration-200
                             text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 
                             text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--color-foreground)]/50 mt-2 text-center">
                AI coach to help you discover your most important task
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}