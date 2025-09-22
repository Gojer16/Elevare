"use client";
import { motion } from "framer-motion";
import { Grid, Clock } from "lucide-react";

interface ArchiveViewToggleProps {
  viewMode: 'grid' | 'timeline';
  onViewChange: (mode: 'grid' | 'timeline') => void;
}

export function ArchiveViewToggle({ viewMode, onViewChange }: ArchiveViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
          ${viewMode === 'grid'
            ? 'text-white shadow-sm'
            : 'text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]/5'
          }
        `}
      >
        {viewMode === 'grid' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-[var(--color-secondary)] rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Grid className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Grid</span>
      </button>
      
      <button
        onClick={() => onViewChange('timeline')}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
          ${viewMode === 'timeline'
            ? 'text-white shadow-sm'
            : 'text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]/5'
          }
        `}
      >
        {viewMode === 'timeline' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-[var(--color-secondary)] rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Clock className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Timeline</span>
      </button>
    </div>
  );
}