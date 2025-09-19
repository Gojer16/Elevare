'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ReflectionPromptsProps {
  showPrompts: boolean;
  onToggle: () => void;
  onPromptSelect: (prompt: string) => void;
}

const reflectionPrompts = [
  "What went well today?",
  "What challenged me today?",
  "What did I learn about myself?",
  "How did I grow today?",
  "What would I do differently?",
  "What am I grateful for?",
  "What's my biggest win today?",
  "How did I handle setbacks?",
  "What patterns do I notice?",
  "What's my intention for tomorrow?"
];

export const ReflectionPrompts: React.FC<ReflectionPromptsProps> = ({
  showPrompts,
  onToggle,
  onPromptSelect
}) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

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
        {showPrompts ? 'Hide' : 'Show'} Reflection Prompts
      </button>

      {/* Prompts Grid */}
      {showPrompts && (
        <div className={`${isMinimal ? 'mb-4' : 'mb-6'} space-y-3`}>
          <h3 className={`${isMinimal ? 'text-lg' : 'text-xl'} font-semibold text-center`}>
            Reflection Prompts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reflectionPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptSelect(prompt)}
                className={`
                  p-3 rounded-lg text-sm text-left transition-colors
                  ${isMinimal 
                    ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700' 
                    : 'bg-[var(--color-card)] hover:bg-[var(--color-primary)]/5'
                  }
                `}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReflectionPrompts;
