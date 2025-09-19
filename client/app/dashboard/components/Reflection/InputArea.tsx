'use client';
import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';

interface InputAreaProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  isLoading
}) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  return (
    <div className={`
      border-t p-4
      ${isMinimal 
        ? 'border-gray-200 dark:border-gray-700' 
        : 'border-[var(--border-color)]'
      }
    `}>
      <div className="flex gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Share your thoughts..."
          className={`
            flex-1 min-h-[60px] max-h-32 px-3 py-2 rounded-lg border resize-none
            ${isMinimal 
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100' 
              : 'textarea'
            }
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
          `}
          disabled={isLoading}
          rows={1}
          aria-label="Reflection input"
        />
        <button
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          className={`
            self-end h-[42px] min-h-[42px] px-4 rounded-lg transition-colors
            ${isMinimal 
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50' 
              : 'btn bg-BrandPrimary text-white'
            }
          `}
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
      <p className={`text-xs opacity-60 mt-2 text-center ${isMinimal ? 'text-gray-600 dark:text-gray-400' : ''}`}>
        Your reflections are private and used only to provide personalized insights.
      </p>
    </div>
  );
};

export default InputArea;
