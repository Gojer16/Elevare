"use client";
import { motion } from "framer-motion";

interface StreakData {
  count: number;
  longest: number;
}

interface DashboardHeaderProps {
  quote?: { text: string; author: string };
  streak?: StreakData;
}

export function DashboardHeader({ quote, streak }: DashboardHeaderProps) {
  return (
    <div className="text-center mb-12">
      {/* Streak Badge - Top Right */}
      {streak && streak.count > 0 && (
        <div className="flex justify-end mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 
            border border-orange-500/20 rounded-full text-sm font-medium shadow-sm"
          >
            <motion.span 
              className="text-lg"
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
            <span className="text-orange-600 dark:text-orange-400 font-bold">{streak.count}</span>
            <span className="text-[var(--color-foreground)]/70 text-xs">day streak</span>
            {streak.count === streak.longest && (
              <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
              Record!
              </span>
            )}
          </motion.div>
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-3xl sm:text-3xl font-bold">
        Welcome back, your focus ritual starts here.
        </h1>
      </div>
      {/* Quote */}
      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4 max-w-lg mx-auto text-center"
        >
          <p className="text-lg font-medium">{"\""}{quote.text}{"\""}</p>
          <p className="text-sm mt-2 opacity-70">— {quote.author}</p>
        </motion.div>
      )}
    </div>
  );
}