"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { StreakDisplay } from "./StreakDisplay";

interface StreakData {
  count: number;
  longest: number;
}

interface FloatingStreakProps {
  streak: StreakData;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export function FloatingStreak({ streak, position = 'bottom-right' }: FloatingStreakProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!streak || streak.count <= 0) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-40`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      {isExpanded ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-80"
        >
          <div className="relative">
            <StreakDisplay streak={streak} variant="full" />
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--card-bg)] hover:bg-[var(--color-secondary)]/10 
                         flex items-center justify-center text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] 
                         transition-colors text-sm"
            >
            ×
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsExpanded(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--card-bg)] hover:bg-[var(--card-bg)]/80 border border-[var(--border-color)] rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200"
        >
          <motion.span 
            className="text-xl"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            🔥
          </motion.span>
          <div className="text-left">
            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {streak.count} days
            </div>
            <div className="text-xs text-[var(--color-foreground)]/60">
            Streak
            </div>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}