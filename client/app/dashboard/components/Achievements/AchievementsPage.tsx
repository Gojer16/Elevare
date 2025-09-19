'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import AchievementsGrid from './AchievementsGrid';
import NextBestAchievement from './NextBestAchievement';
import { getNextBestAchievement, NextBestAchievementData } from '@/app/lib/nextBestAchievement';
import { useTheme } from '@/contexts/ThemeContext';

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
  category: string;
}

interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
}

/**
 * AchievementsPage Component
 * 
 * Main achievements page that displays user progress, next best achievement, and filtered achievement grid.
 * Integrates with theme system for consistent styling across Minimal/Modern layouts.
 * 
 * Key Features:
 * - Next Best Achievement: Shows the most relevant unlocked target with AI suggestions.
 * - Progress tracking: Real-time progress bars and completion percentages.
 * - Filtering: Category, status, and search-based filtering.
 * - Theme integration: Respects user's Minimal/Modern layout preference.
 * - Accessibility: Full ARIA support and keyboard navigation.
 * 
 * Data Flow:
 * 1. Fetches achievements and progress from /api/achievements/progress.
 * 2. Calculates next best achievement using strategic scoring algorithm.
 * 3. Applies filters and search to display relevant achievements.
 * 4. Updates UI based on theme preference (Minimal/Modern)
 */
export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [query, setQuery] = useState('');
  /**
   * progressById - Achievement progress tracking map.
   * 
   * Maps achievement IDs to their progress data for efficient lookups.
   * Contains real-time progress information for each achievement.
   * 
   * Structure:
   * {
   *   [achievementId]: {
   *     target: number | null,        // Target value to unlock (e.g., 10 tasks)
   *     current: number,              // Current progress value
   *     unlocked: boolean,            // Whether achievement is unlocked
   *     unlockedAt?: string | null,   // ISO timestamp when unlocked
   *     conditionText?: string | null // Human-readable condition description
   *   }
   * }
   * 
   * Used for:
   * - Progress bar calculations
   * - Unlock status checks
   * - Next best achievement scoring
   * - Achievement card data binding
   */
  const [progressById] = useState<Record<string, { target: number | null; current: number; unlocked: boolean; unlockedAt?: string | null; conditionText?: string | null }>>({});
  const [nextBestAchievement, setNextBestAchievement] = useState<NextBestAchievementData | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchAchievements();
    }
  }, [status, session]);

  const fetchAchievements = async () => {
    try {
      setError(null);
      const res = await fetch('/api/achievements/progress');
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(`Failed to fetch achievements: ${res.status} ${res.statusText} ${text ?? ''}`);
      }
      const data = await res.json();
      const progress = data.progress as Array<Achievement & { target: number | null; current: number; unlocked: boolean; unlockedAt?: string | null; conditionText?: string | null }>;
      setAchievements(progress.map(p => ({ id: p.id, code: p.code, title: p.title, description: p.description, icon: p.icon, category: p.category })));
      setUserAchievements(progress.filter(p => p.unlocked).map(p => ({ achievementId: p.id, unlockedAt: p.unlockedAt || '' })));

      // Calculate next best achievement
      const achievementsWithProgress = progress.map(p => ({
        id: p.id,
        code: p.code,
        title: p.title,
        description: p.description,
        icon: p.icon,
        category: p.category,
        progress: { target: p.target, current: p.current, unlocked: p.unlocked, unlockedAt: p.unlockedAt, conditionText: p.conditionText }
      }));
      
      const nextBest = getNextBestAchievement(achievementsWithProgress, {
        tasksCompleted: 0, // TODO: Get from actual stats
        reflectionsWritten: 0,
        streakCount: 0,
        longestStreak: 0
      });
      setNextBestAchievement(nextBest);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = useCallback((achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  }, [userAchievements]);

  /**
   * totals - Achievement completion statistics
   * 
   * Calculates overall progress metrics for the user's achievement journey.
   * Used to display completion percentage and motivate continued progress.
   * 
   * @returns Object containing:
   * - total: Total number of available achievements
   * - unlocked: Number of achievements user has unlocked
   * - completion: Percentage of achievements completed (0-100)
   */
  const totals = useMemo(() => {
    const total = achievements.length;
    const unlocked = userAchievements.length;
    const completion = total ? Math.round((unlocked / total) * 100) : 0;
    return { total, unlocked, completion };
  }, [achievements, userAchievements]);

  const categories = useMemo(() => ['ALL', 'TASK', 'STREAK', 'REFLECTION', 'OTHER'], []);

  /**
   * filteredAchievements - Filtered and searched achievement list
   * 
   * Applies multiple filters to the achievements list based on user selections.
   * Supports category filtering, status filtering (unlocked/locked), and text search.
   * 
   * Filter Logic:
   * 1. Category filter: Shows only achievements from selected category (TASK, STREAK, etc.)
   * 2. Status filter: Shows only unlocked or locked achievements
   * 3. Search filter: Searches in title and code fields (case-insensitive)
   * 
   * @returns Filtered array of achievements matching all active filters
   */
  const filteredAchievements = useMemo(() => {
    let list = achievements;
    
    // Category filtering
    if (activeCategory !== 'ALL') {
      list = list.filter(a => (a.category || 'OTHER') === activeCategory);
    }
    
    // Status filtering (unlocked/locked)
    if (filter !== 'ALL') {
      list = list.filter(a => (filter === 'UNLOCKED' ? isUnlocked(a.id) : !isUnlocked(a.id)));
    }
    
    // Text search filtering
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.code.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [achievements, activeCategory, filter, query, isUnlocked]);


  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 h-8 w-48 bg-gray-100 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0,1,2].map(i => (<div key={i} className="h-20 bg-gray-100 animate-pulse rounded"></div>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_,i) => (<div key={i} className="h-40 bg-gray-100 animate-pulse rounded"></div>))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h1>
        <p className="text-gray-600 dark:text-gray-300">Please sign in to view your achievements.</p>
      </div>
    );
  }

  // Theme-based layout adjustments
  const isMinimal = theme === 'minimal';
  const containerClass = isMinimal 
    ? "max-w-4xl mx-auto px-4 py-6" 
    : "max-w-5xl mx-auto px-4 py-8";
  const cardClass = isMinimal 
    ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
    : "card";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>Achievements</h1>
          <p className="text-sm" style={{ color: 'var(--color-foreground)' }}>Complete tasks and reflections to unlock achievements</p>
        </div>
        <a href="/dashboard" className="btn btn-outline">Back to Dashboard</a>
      </motion.div>

      {/* Totals header */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${isMinimal ? 'space-y-2' : ''}`}>
        <div className={`${cardClass} p-4 text-center`}>
          <div className="text-sm mb-1" style={{ color:'var(--color-foreground)'}}>Unlocked</div>
          <div className="text-2xl font-bold">{totals.unlocked}</div>
        </div>
        <div className={`${cardClass} p-4 text-center`}>
          <div className="text-sm mb-1" style={{ color:'var(--color-foreground)'}}>Total</div>
          <div className="text-2xl font-bold">{totals.total}</div>
        </div>
        <div className={`${cardClass} p-4 text-center`}>
          <div className="text-sm mb-1" style={{ color:'var(--color-foreground)'}}>Completion</div>
          <div className="text-2xl font-bold">{totals.completion}%</div>
        </div>
      </div>

      {/* Next Best Achievement */}
      {nextBestAchievement && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>
            🎯 Next Best Achievement
          </h2>
          <NextBestAchievement
            achievement={nextBestAchievement.achievement}
            progress={nextBestAchievement.progress}
            suggestion={nextBestAchievement.suggestion}
            priority={nextBestAchievement.priority}
          />
        </div>
      )}

      {/* Filters */}
      <div className={`${cardClass} p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between`} aria-live="polite">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button key={cat} className={`btn ${activeCategory===cat?'text-white bg-BrandPrimary':'btn-outline'}`} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory===cat}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <select 
          aria-label="Filter by status" 
          className="btn btn-outline" 
          value={filter} 
          onChange={e=>setFilter(e.target.value as 'ALL' | 'UNLOCKED' | 'LOCKED')}
          >
            <option value="ALL">All</option>
            <option value="UNLOCKED">Unlocked</option>
            <option value="LOCKED">Locked</option>
          </select>
          <input 
          aria-label="Search achievements" 
          className="btn-outline rounded-lg p-2" 
          placeholder="Search…" 
          value={query} 
          onChange={e=>setQuery(e.target.value)} 
          />
        </div>
      </div>

      {error && (
        <div className={`${cardClass} p-4 mb-6`} role="alert" aria-live="assertive">
          <div className="flex items-center justify-between">
            <p style={{ color: 'var(--color-foreground)'}}>{error}</p>
            <button className="btn btn-outline" onClick={fetchAchievements}>Retry</button>
          </div>
        </div>
      )}

      <AchievementsGrid
        items={filteredAchievements.map(a => ({
          ...a,
          progress: progressById[a.id] ?? { target: 0, current: 0, unlocked: false },
        }))}
      />
    </div>
  );
}