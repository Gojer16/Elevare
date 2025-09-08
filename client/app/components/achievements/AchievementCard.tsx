'use client';
import React from 'react';
import { motion } from 'framer-motion';

export interface AchievementLite {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
  category: string;
}

export interface AchievementProgress {
  target: number | null;
  current: number;
  unlocked: boolean;
  unlockedAt?: string | null;
  conditionText?: string | null;
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="w-full bg-gray-200 rounded-full h-2"
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${v}%`}
    >
      <motion.div
        className="h-2 rounded-full"
        style={{ backgroundColor: 'var(--color-secondary)' }}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export const AchievementCard: React.FC<{
  achievement: AchievementLite;
  progress: AchievementProgress;
}> = ({ achievement, progress }) => {
  const { unlocked, unlockedAt, target, current, conditionText } = progress;
  const progressPercent =
    target && target > 0
      ? Math.min(100, Math.round((current / target) * 100))
      : unlocked
      ? 100
      : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      animate={
        unlocked
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0px rgba(0,0,0,0)',
                '0 0 12px rgba(255, 215, 0, 0.6)',
                '0 0 0px rgba(0,0,0,0)',
              ],
            }
          : {}
      }
      transition={unlocked ? { duration: 1, repeat: 1 } : {}}
      className={`rounded-xl p-6 border-2 transition-all duration-300 ${
        unlocked ? 'border-accent' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start">
        <div
          className={`h-10 w-10 rounded-lg mr-4 flex items-center justify-center ${
            unlocked ? 'bg-accent' : 'bg-gray-100'
          }`}
          style={{ color: unlocked ? '#fff' : 'inherit' }}
          aria-label={`Achievement icon for ${achievement.title}`}
        >
          <span className="text-2xl">{achievement.icon || '🏆'}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3
              className="font-bold text-lg"
              style={{ color: 'var(--color-foreground)' }}
            >
              {achievement.title}
            </h3>
            {unlocked && <span className="badge badge-primary">Unlocked</span>}
          </div>
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--color-foreground)' }}
          >
            {achievement.description}
          </p>

          {!unlocked && (
            <div className="mt-3">
              <ProgressBar value={progressPercent} />
              {typeof target === 'number' && target > 0 && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {current < target
                    ? `${target - current} more to reach ${target}`
                    : 'On track'}
                </p>
              )}
              {conditionText && (
                <p
                  className="text-xs opacity-80"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {conditionText}
                </p>
              )}
              {achievement.category === 'TASK' && (
                <a href="/dashboard" className="btn btn-outline mt-2">
                  Complete a task now
                </a>
              )}
            </div>
          )}

          {unlocked && unlockedAt && (
            <p
              className="mt-3 text-xs"
              style={{ color: 'var(--color-foreground)' }}
            >
              Unlocked on {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
