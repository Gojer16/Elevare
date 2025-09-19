"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import ReflectionPrompts from "@/app/dashboard/components/Reflection/ReflectionPrompts";
import ReflectionHistory from "@/app/dashboard/components/Reflection/ReflectionHistory";
import ChatMessages from "@/app/dashboard/components/Reflection/ChatMessages";
import InputArea from "@/app/dashboard/components/Reflection/InputArea";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
}

interface Reflection {
  id: string;
  content: string;
  createdAt: string;
}

export default function ReflectionPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [reflectionHistory, setReflectionHistory] = useState<Reflection[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  
  // Theme-based layout adjustments
  const isMinimal = theme === 'minimal';
  const containerClass = isMinimal 
    ? "w-full max-w-4xl mx-auto px-4 py-6" 
    : "w-full max-w-2xl mx-auto px-4 py-12";
  const chatHeight = isMinimal ? "h-[400px]" : "h-[500px]";

  const loadReflectionHistory = async () => {
    try {
      const response = await fetch('/api/reflection?limit=10');
      if (response.ok) {
        const data = await response.json();
        setReflectionHistory(data.reflections || []);
      }
    } catch (error) {
      console.error('Error loading reflection history:', error);
    }
  };

  // Load reflection history on component mount
  useEffect(() => {
    loadReflectionHistory();
  }, []);

  // Handle sending a message
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Call real AI service
      const response = await fetch('/api/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          conversationId: null // Could be used to link to specific tasks
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.aiResponse,
        role: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process that right now. Please try again.",
        role: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300`}>
      <div className={containerClass}>
        <div className={`text-center ${isMinimal ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`${isMinimal ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold mb-3`}>
            {isMinimal ? 'Reflection' : 'Daily Reflection'}
          </h1>
          <p className={`${isMinimal ? 'text-sm' : 'text-base'} opacity-80`}>
            {isMinimal 
              ? 'Process your thoughts with AI guidance.' 
              : 'Chat with your AI coach to process today\'s progress and plan ahead.'
            }
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`${isMinimal ? 'mb-4' : 'mb-6'} p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800`}>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`${isMinimal ? 'mb-4' : 'mb-6'} flex flex-wrap gap-2 justify-center`}>
          <ReflectionPrompts
            showPrompts={showPrompts}
            onToggle={() => setShowPrompts(!showPrompts)}
            onPromptSelect={handlePromptSelect}
          />
          
          <ReflectionHistory
            showHistory={showHistory}
            onToggle={() => setShowHistory(!showHistory)}
            reflections={reflectionHistory}
          />
        </div>

        {/* Chat Container */}
        <div className={`
          mb-6 rounded-lg
          ${isMinimal 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
            : 'card'
          }
        `}>
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            chatHeight={chatHeight}
          />
          
          <InputArea
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}