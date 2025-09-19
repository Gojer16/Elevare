'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Reflection {
  id: string;
  content: string;
  createdAt: string;
}

interface ReflectionHistoryProps {
  showHistory: boolean;
  onToggle: () => void;
  reflections: Reflection[];
}

export const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({
  showHistory,
  onToggle,
  reflections
}) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  if (reflections.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          text-sm px-4 py-2 rounded-lg transition-colors
          ${isMinimal 
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20'
          }
        `}
      >
        {showHistory ? 'Hide' : 'Show'} History ({reflections.length})
      </button>

      {/* History List */}
      {showHistory && (
        <div className={`${isMinimal ? 'mb-4' : 'mb-6'} space-y-3`}>
          <h3 className={`${isMinimal ? 'text-lg' : 'text-xl'} font-semibold`}>
            Recent Reflections
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {reflections.slice(0, 5).map((reflection) => (
              <div
                key={reflection.id}
                className={`
                  p-3 rounded-lg text-sm
                  ${isMinimal 
                    ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
                    : 'bg-[var(--color-card)]'
                  }
                `}
              >
                <p className="opacity-80 mb-1">
                  {reflection.content.substring(0, 100)}...
                </p>
                <p className="text-xs opacity-60">
                  {new Date(reflection.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReflectionHistory;
