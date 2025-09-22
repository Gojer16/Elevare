"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface ArchiveEmptyStateProps {
  hasSearchQuery?: boolean;
  searchQuery?: string;
}

export function ArchiveEmptyState({ hasSearchQuery = false, searchQuery = "" }: ArchiveEmptyStateProps) {
  if (hasSearchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
            No matches found
          </h3>
          <p className="text-[var(--color-foreground)]/70 mb-6">
            We couldn&apos;t find any tasks matching &quot;{searchQuery}&quot;. 
            Try adjusting your search terms or filters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 
                         text-[var(--color-secondary)] rounded-xl transition-colors font-medium"
            >
              Clear Search
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 
                         text-white rounded-xl transition-colors font-medium"
            >
              Add New Task
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="max-w-lg mx-auto">
        {/* Animated Book Stack */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              rotateY: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-8xl"
          >
            📚
          </motion.div>
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute -top-2 -right-2 text-2xl"
          >
            ✨
          </motion.div>
        </div>

        <h3 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
          Your Archive Awaits
        </h3>
        
        <p className="text-lg text-[var(--color-foreground)]/70 mb-8 leading-relaxed">
          This is where your completed tasks will live — a growing collection of your daily wins, 
          reflections, and proof that consistent focus creates extraordinary results.
        </p>

        <div className="bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 
                        border border-[var(--color-secondary)]/20 rounded-2xl p-6 mb-8">
          <h4 className="font-semibold text-[var(--color-foreground)] mb-3">
            What you&apos;ll see here:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--color-foreground)]/80">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              Completed tasks
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">💭</span>
              Your reflections
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">🏷️</span>
              Task categories
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">📊</span>
              Progress tracking
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                       hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white rounded-xl 
                       transition-all duration-200 font-semibold"
          >
            🎯 Create Your First Task
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-[var(--card-bg)] hover:bg-[var(--color-secondary)]/10 
                       border border-[var(--border-color)] text-[var(--color-foreground)] 
                       rounded-xl transition-colors font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}