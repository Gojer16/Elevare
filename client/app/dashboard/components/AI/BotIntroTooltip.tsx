"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

interface BotIntroTooltipProps {
  isVisible: boolean;
  onDismiss: () => void;
  onOpenBot: () => void;
}

export function BotIntroTooltip({ isVisible, onDismiss, onOpenBot }: BotIntroTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [isVisible]);

  const handleTryIt = () => {
    setShowTooltip(false);
    onOpenBot();
    onDismiss();
  };

  const handleDismiss = () => {
    setShowTooltip(false);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="fixed bottom-20 right-6 max-w-sm bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-2xl p-6 z-50"
        >
          {/* Arrow pointing to bot button */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[var(--card-bg)] border-r border-b border-[var(--border-color)] transform rotate-45"></div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Meet your AI assistant!</h3>
                <p className="text-xs text-[var(--color-foreground)]/60">NEW</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-[var(--color-foreground)]/10 transition-colors"
            >
            <X className="w-4 h-4 text-[var(--color-foreground)]/60" />
            </button>
          </div>

          <p className="text-sm text-[var(--color-foreground)]/80 mb-4 leading-relaxed">
          Struggling to decide what to focus on? I can help you discover your most important task through a quick conversation.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleTryIt}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200"
            >
            Try it now
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] text-sm transition-colors"
            >
            Maybe later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}