'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
  variant?: 'success' | 'warning' | 'info'; // for customization
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose, variant = 'success' }) => {
  // Auto-dismiss after 5s
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Variant styling
  const variantClasses = {
    success: 'border-accent',
    warning: 'border-yellow-400',
    info: 'border-blue-400',
  };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        max-w-sm bg-white dark:bg-gray-800 
        rounded-lg shadow-xl overflow-hidden border
        ${variantClasses[variant]}
      `}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 text-2xl">
          {achievement.icon || '🏆'}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-[var(--color-primary)]">
          Achievement Unlocked!
          </p>
          <p className="text-lg font-bold text-[var(--color-foreground)]">
          {achievement.title}
          </p>
          <p className="text-sm text-[var(--color-foreground)]">
          {achievement.description}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 
                 8.586l4.293-4.293a1 1 0 111.414 
                 1.414L11.414 10l4.293 4.293a1 1 
                 0 01-1.414 1.414L10 11.414l-4.293 
                 4.293a1 1 0 01-1.414-1.414L8.586 
                 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* Progress bar timer */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        className="h-1 bg-[var(--color-secondary)]"
      />
    </motion.div>
  );
};

interface AchievementToastContainerProps {
  achievements: Achievement[];
  onRemove: (id: string) => void;
}

export const AchievementToastContainer: React.FC<AchievementToastContainerProps> = ({
  achievements,
  onRemove,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById('toast-root') || document.body;

  return createPortal(
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end space-y-3 p-4">
      <AnimatePresence>
        {achievements.map((achievement) => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onClose={() => onRemove(achievement.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    portalRoot
  );
};

export default AchievementToast;
