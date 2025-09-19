'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AchievementLite, AchievementProgress } from './AchievementCard';
import { useTheme } from '@/contexts/ThemeContext';

export interface NextBestAchievementProps {
  achievement: AchievementLite;
  progress: AchievementProgress;
  suggestion?: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * NextBestAchievement Component
 * 
 * Displays the most relevant unlocked achievement target to help users focus on their next goal.
 * Integrates with theme system to provide consistent styling across Minimal/Modern layouts.
 * 
 * @param achievement - The achievement data (title, description, icon, etc.)
 * @param progress - Progress tracking data (current, target, unlocked status)
 * @param suggestion - AI-generated suggestion for how to achieve this goal
 * @param priority - Priority level affecting visual emphasis
 */
export const NextBestAchievement: React.FC<NextBestAchievementProps> = ({
  achievement,
  progress,
  suggestion,
  priority
}) => {
  const { theme } = useTheme();
  const { target, current, unlocked } = progress;
  
  // Calculate progress percentage
  const progressPercent = target && target > 0 
    ? Math.min(100, Math.round((current / target) * 100))
    : unlocked ? 100 : 0;
  
  // Determine remaining count
  const remaining = target && target > 0 ? Math.max(0, target - current) : 0;
  
  // Priority-based styling
  const priorityStyles = {
    high: {
      border: 'border-2 border-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-500',
      accent: 'text-red-600 dark:text-red-400'
    },
    medium: {
      border: 'border-2 border-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-500',
      accent: 'text-yellow-600 dark:text-yellow-400'
    },
    low: {
      border: 'border-2 border-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-500',
      accent: 'text-blue-600 dark:text-blue-400'
    }
  };
  
  const styles = priorityStyles[priority];
  
  // Theme-specific layout adjustments
  const isMinimal = theme === 'minimal';
  
  if (unlocked) {
    return null; // Don't show unlocked achievements as "next best"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-xl p-6 mb-6
        ${styles.border} ${styles.bg}
        ${isMinimal ? 'shadow-sm' : 'shadow-lg'}
        transition-all duration-300 hover:shadow-xl
      `}
      role="region"
      aria-label={`Next best achievement: ${achievement.title}`}
    >
      {/* Priority indicator */}
      <div className="absolute top-3 right-3">
        <span className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${styles.accent} bg-white/80 dark:bg-gray-800/80
        `}>
          {priority === 'high' && '🔥 High Priority'}
          {priority === 'medium' && '⚡ Medium Priority'}
          {priority === 'low' && '💡 Low Priority'}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        {/* Achievement Icon */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
          ${styles.icon} bg-white/60 dark:bg-gray-800/60
        `}>
          <span className="text-2xl">{achievement.icon || '🎯'}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`
                font-bold text-lg leading-tight
                ${isMinimal ? 'text-gray-900 dark:text-white' : styles.accent}
              `}>
                {achievement.title}
              </h3>
              <p className={`
                mt-1 text-sm
                ${isMinimal ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'}
              `}>
                {achievement.description}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-4 space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className={styles.accent}>
                  Progress: {current}/{target || '?'}
                </span>
                <span className={styles.accent}>
                  {progressPercent}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-BrandSecondary to-BrandPrimary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-2">
              {remaining > 0 && (
                <p className={`
                  text-sm font-medium
                  ${styles.accent}
                `}>
                  {remaining === 1 
                    ? 'Just 1 more to unlock!' 
                    : `${remaining} more to unlock!`
                  }
                </p>
              )}

              {/* AI Suggestion */}
              {suggestion && (
                <div className={`
                  p-3 rounded-lg text-sm
                  ${isMinimal 
                    ? 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200' 
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300'
                  }
                `}>
                  <span className="font-medium">💡 Suggestion:</span> {suggestion}
                </div>
              )}

              {/* Quick Action Button */}
              <div className="pt-2">
                {achievement.category === 'TASK' && (
                  <a 
                    href="/dashboard" 
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isMinimal 
                        ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                        : 'bg-gradient-to-r from-BrandSecondary to-BrandPrimary text-white hover:from-BrandSecondary hover:to-BrandPrimary'
                      }
                    `}
                  >
                    Complete a Task →
                  </a>
                )}
                {achievement.category === 'STREAK' && (
                  <a 
                    href="/dashboard" 
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isMinimal 
                        ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      }
                    `}
                  >
                    Build Your Streak →
                  </a>
                )}
                {achievement.category === 'REFLECTION' && (
                  <a 
                    href="/dashboard/reflection" 
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isMinimal 
                        ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                        : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                      }
                    `}
                  >
                    Write Reflection →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NextBestAchievement;
