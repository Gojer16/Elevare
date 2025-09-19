'use client';
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  chatHeight: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  chatHeight
}) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`
      ${chatHeight} overflow-y-auto p-4 space-y-4
    `}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3
                ${message.role === "user"
                  ? isMinimal
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-none"
                    : "bg-[var(--color-primary)] text-white rounded-br-none"
                  : isMinimal
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    : "bg-[var(--card-bg)] text-[var(--color-foreground)] rounded-bl-none"
                }
              `}
              role="article"
              aria-label={`Message from ${message.role === 'user' ? 'you' : 'AI coach'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === "ai" ? (
                  <FaRobot className="text-[var(--color-primary)]" />
                ) : (
                  <FaUser className="text-white" />
                )}
                <span className="text-xs font-medium opacity-80">
                  {message.role === "ai" ? "AI Coach" : "You"}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
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
          <div className="bg-[var(--card-bg)] text-[var(--color-foreground)] rounded-2xl rounded-bl-none px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <FaRobot className="text-[var(--color-primary)]" />
              <span className="text-xs font-medium opacity-80">AI Coach</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
