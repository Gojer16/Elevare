"use client";
import { motion } from "framer-motion";

interface DashboardBackgroundProps {
  variant?: 'soft' | 'minimal' | 'warm' | 'cool' | 'focus' | 'archive';
}

export function DashboardBackground({ variant = 'soft' }: DashboardBackgroundProps) {
  const backgrounds = {
    // Soft and welcoming (default)
    soft: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/15 to-purple-200/15 dark:from-blue-800/8 dark:to-purple-800/8 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/15 to-orange-200/15 dark:from-pink-800/8 dark:to-orange-800/8 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-green-200/10 to-teal-200/10 dark:from-green-800/6 dark:to-teal-800/6 rounded-full blur-3xl opacity-25" />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
    ),

    // Clean and minimal
    minimal: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
        <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
    ),

    // Warm and energizing
    warm: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50/50 to-red-50/30 dark:from-orange-900/20 dark:via-yellow-900/10 dark:to-red-900/20" />
        <motion.div 
          className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-r from-orange-300/15 to-yellow-300/15 dark:from-orange-700/8 dark:to-yellow-700/8 rounded-full blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-r from-red-300/15 to-pink-300/15 dark:from-red-700/8 dark:to-pink-700/8 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>
    ),

    // Cool and calming
    cool: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50/30 to-teal-50/50 dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-teal-900/20" />
        <motion.div 
          className="absolute top-0 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-blue-700/10 dark:to-cyan-700/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-300/20 to-green-300/20 dark:from-teal-700/10 dark:to-green-700/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [360, 180, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
    ),

    // Focus mode - very subtle
    focus: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-stone-50 dark:from-neutral-900 dark:to-stone-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-neutral-200/5 to-stone-200/5 dark:from-neutral-700/5 dark:to-stone-700/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.005] dark:opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
    ),

    // Archive mode - completely static for smooth scrolling
    archive: (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-indigo-900/15" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 dark:from-blue-800/5 dark:to-purple-800/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/10 to-orange-200/10 dark:from-pink-800/5 dark:to-orange-800/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-green-200/8 to-teal-200/8 dark:from-green-800/4 dark:to-teal-800/4 rounded-full blur-3xl opacity-30" />
      </div>
    )
  };

  return backgrounds[variant];
}