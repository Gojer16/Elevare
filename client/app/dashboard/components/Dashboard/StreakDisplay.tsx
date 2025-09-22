"use client";
import { motion } from "framer-motion";

interface StreakData {
  count: number;
  longest: number;
}

interface StreakDisplayProps {
  streak: StreakData;
  variant?: 'compact' | 'full' | 'badge';
}

export function StreakDisplay({ streak, variant = 'full' }: StreakDisplayProps) {
  if (!streak || streak.count <= 0) return null;

  // Compact badge version (for header area)
  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-sm font-medium"
      >
        <div className="flex items-center gap-1">
          <span className="text-lg">🔥</span>
          <span className="text-orange-600 dark:text-orange-400 font-bold">{streak.count}</span>
        </div>
        <span className="text-[var(--color-foreground)]/70 text-xs">day streak</span>
      </motion.div>
    );
  }

  // Compact version (for sidebar or small spaces)
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="font-bold text-orange-600 dark:text-orange-400">{streak.count} days</div>
            <div className="text-xs text-[var(--color-foreground)]/60">Best: {streak.longest}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full version (main display)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 border border-orange-500/20 p-6 shadow-lg"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Fire emoji with animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-4xl"
          >
          🔥
          </motion.div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {streak.count}
              </span>
              <span className="text-lg font-medium text-[var(--color-foreground)]">
                {streak.count === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="text-sm text-[var(--color-foreground)]/70 mt-1">
            Keep the momentum going!
            </p>
          </div>
        </div>

        {/* Personal best indicator */}
        <div className="text-right">
          <div className="text-xs text-[var(--color-foreground)]/50 uppercase tracking-wide font-medium">
          Personal Best
          </div>
          <div className="text-xl font-bold text-[var(--color-secondary)]">
            {streak.longest}
          </div>
          {streak.count === streak.longest && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-green-600 dark:text-green-400 font-medium mt-1"
            >
            🎉 New Record!
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress bar showing streak vs personal best */}
      <div className="mt-4 relative">
        <div className="h-2 bg-[var(--card-bg)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((streak.count / streak.longest) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--color-foreground)]/50 mt-1">
          <span>Current streak</span>
          <span>Personal best: {streak.longest}</span>
        </div>
      </div>
    </motion.div>
  );
}