"use client";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

interface StreakData {
  count: number;
  longest: number;
}

interface StreakDisplayProps {
  streak: StreakData;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  if (!streak || streak.count <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mb-8"
    >
      <div className="card p-4 flex items-center justify-center gap-3">
        <FiTrendingUp 
          className="text-xl" 
          style={{ color: 'var(--color-secondary)' }} 
        />
        <span 
          className="font-bold" 
          style={{ color: 'var(--color-secondary)' }}
        >
          {streak.count} day streak!
        </span>
        <span 
          className="text-sm" 
          style={{ color: 'var(--color-foreground)' }}
        >
          (Longest: {streak.longest})
        </span>
      </div>
    </motion.div>
  );
}