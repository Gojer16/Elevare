'use client';
import React from 'react';
import AchievementCard, { AchievementLite, AchievementProgress } from './AchievementCard';
import { motion, AnimatePresence } from 'framer-motion';

export interface GridItem extends AchievementLite {
  progress: AchievementProgress;
}

export const AchievementsGrid: React.FC<{ items: GridItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="card p-6 mt-6 text-center">
        <p className="mb-3" style={{ color: 'var(--color-foreground)' }}>No achievements found for your filters.</p>
        <a className="btn btn-primary" href="/dashboard">Go to Dashboard</a>
      </div>
    );
  }

  return (
    <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.3 }}
    exit={{opacity: 0, y: -10}}
    aria-label="Achievements list"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((a) => (
        <AchievementCard key={a.id} 
        achievement={a} 
        progress={a.progress} 
        />
      ))}
    </motion.section>
  );
};

export default AchievementsGrid;
