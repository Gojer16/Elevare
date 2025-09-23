"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Sparkles, Heart, Brain, Target } from "lucide-react";

interface Reflection {
  id: string;
  content: string;
  createdAt: string;
  mood?: 'great' | 'good' | 'okay' | 'challenging';
  tags?: string[];
  wordCount?: number;
}

interface ReflectionJournalProps {
  reflections: Reflection[];
  onReflectionSelect?: (reflection: Reflection) => void;
}

export function ReflectionJournal({ reflections, onReflectionSelect }: ReflectionJournalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'length'>('date');
  const [filteredReflections, setFilteredReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    let filtered = reflections;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reflection =>
        reflection.content.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return (b.wordCount || 0) - (a.wordCount || 0);
      }
    });

    setFilteredReflections(sorted);
  }, [reflections, searchQuery, sortBy]);

  if (reflections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-6">📖</div>
        <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
          Your Reflection Journal
        </h3>
        <p className="text-[var(--color-foreground)]/70 mb-6 max-w-md mx-auto">
          This is where your reflections will live. Start by completing a task and adding your first reflection.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-foreground)]/60">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Gratitude</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Growth</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-[var(--color-secondary)]" />
          <h2 className="text-3xl font-bold text-[var(--color-foreground)]">
            Reflection Journal
          </h2>
        </div>
        <p className="text-[var(--color-foreground)]/70">
          {reflections.length} reflection{reflections.length !== 1 ? 's' : ''} • Your journey of growth and self-discovery
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground)]/40" />
            <input
              type="text"
              placeholder="Search your reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                         focus:border-[var(--color-secondary)] transition-all duration-200
                         text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'length')}
              className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                         text-[var(--color-foreground)]"
            >
              <option value="date">📅 Most Recent</option>
              <option value="length">📝 Longest First</option>
            </select>

            <div className="text-sm text-[var(--color-foreground)]/60 flex items-center">
              Showing {filteredReflections.length} of {reflections.length}
            </div>
          </div>
        </div>
      </div>

      {/* Reflections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredReflections.map((reflection, index) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 
                         hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 
                         transition-all duration-200 cursor-pointer group"
              onClick={() => onReflectionSelect?.(reflection)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm text-[var(--color-foreground)]/60">
                      {new Date(reflection.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                    <div className="text-xs text-[var(--color-foreground)]/40">
                      {reflection.wordCount || 0} words
                    </div>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Preview */}
              <p className="text-[var(--color-foreground)]/80 line-clamp-4 leading-relaxed mb-4">
                {reflection.content}
              </p>

              {/* Tags */}
              {reflection.tags && reflection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reflection.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] 
                                 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {reflection.tags.length > 3 && (
                    <span className="px-2 py-1 bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]/60 
                                     rounded-full text-xs">
                      +{reflection.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredReflections.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
            No reflections found
          </h3>
          <p className="text-[var(--color-foreground)]/60">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  );
}