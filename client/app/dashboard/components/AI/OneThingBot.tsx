"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Target, Brain } from "lucide-react";

interface Message {
    id: string;
    content: string;
    role: "user" | "bot";
    timestamp: Date;
    suggestions?: string[];
}

interface OneThingBotProps {
    onTaskSuggestion: (task: string) => void;
    isVisible: boolean;
    onToggle: () => void;
}

export function OneThingBot({ onTaskSuggestion, isVisible, onToggle }: OneThingBotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'initial-welcome',
            content: "Hello! I'm your ONE Thing assistant. What's on your mind? Let's find your most important task for today.",
            role: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || inputValue.trim();
        if (!text || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: text,
            role: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("https://elevare-ai-assistant.vercel.app/api/ai/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: text, currentTasks: [] })
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();

            let messageContent = "";
            let messageSuggestions: string[] | undefined = [];

            if (data.mode === 'exploration' && data.exploration) {
                messageContent = data.exploration.content;
                messageSuggestions = data.exploration.suggestions;
            } else if (data.mode === 'task-suggestion' && data.suggestion) {
                messageContent = `Here's a task suggestion for you: "${data.suggestion.name}". ${data.suggestion.rationale}`;
            } else {
                throw new Error("Invalid API response structure");
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: messageContent,
                role: "bot",
                timestamp: new Date(),
                suggestions: messageSuggestions
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error getting bot response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "I'm having trouble thinking right now. Could you try rephrasing that?",
                role: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    const handleSuggestionClick = (suggestion: string) => {
        handleSend(suggestion);
    };

    if (!isVisible) {
        return (
            <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                   text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
            >
                <MessageCircle className="w-6 h-6" />
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] 
                 shadow-2xl z-40 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-foreground)]">ONE Thing Assistant</h3>
                        <p className="text-xs text-[var(--color-foreground)]/60">Here to help you focus</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded-full hover:bg-[var(--color-foreground)]/10 transition-colors"
                    >
                        <motion.div
                            animate={{ rotate: isMinimized ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Target className="w-4 h-4 text-[var(--color-foreground)]/60" />
                        </motion.div>
                    </button>
                    <button
                        onClick={onToggle}
                        className="p-1 rounded-full hover:bg-[var(--color-foreground)]/10 transition-colors"
                    >
                        <X className="w-4 h-4 text-[var(--color-foreground)]/60" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-3">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                        ? "bg-[var(--color-secondary)] text-white rounded-br-none"
                                        : "bg-[var(--color-foreground)]/5 text-[var(--color-foreground)] rounded-bl-none"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{message.content}</p>

                                        {/* Suggestions */}
                                        {message.suggestions && (
                                            <div className="mt-3 space-y-2">
                                                {message.suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="block w-full text-left p-2 rounded-lg bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs transition-colors"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-[var(--color-foreground)]/5 rounded-2xl rounded-bl-none px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    className="w-2 h-2 bg-[var(--color-secondary)] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    className="w-2 h-2 bg-[var(--color-secondary)] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    className="w-2 h-2 bg-[var(--color-secondary)] rounded-full"
                                                />
                                            </div>
                                            <span className="text-xs text-[var(--color-foreground)]/60">Thinking...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-[var(--border-color)]">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask me anything about finding your focus..."
                                    className="flex-1 px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="p-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                                            <p className="text-xs text-[var(--color-foreground)]/50 mt-2 text-center">
                                            I&apos;ll help you discover your most important task
                                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}