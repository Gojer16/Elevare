import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

interface AchievementWithProgress {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
  category: string;
  createdAt: Date;
  current: number;
  target: number;
  unlocked: boolean;
  progressPercent: number;
}

/**
 * AI-Powered Achievement Suggestions API
 * 
 * Provides intelligent suggestions for which achievements to focus on next.
 * Analyzes user patterns and suggests the most effective path to unlock achievements.
 * 
 * Features:
 * - Domino effect analysis (achievements that unlock others)
 * - User behavior pattern recognition
 * - Difficulty-based prioritization
 * - Momentum-based suggestions
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Get user's current stats and achievement progress
    const [userStats, achievements, unlockedAchievements] = await Promise.all([
      // User statistics
      prisma.$transaction([
        prisma.task.count({ where: { userId, isDone: true } }),
        prisma.task.count({ where: { userId, isDone: true, reflection: { not: null } } }),
        prisma.streak.findUnique({ where: { userId } }),
        prisma.task.findFirst({ 
          where: { userId, isDone: true }, 
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true }
        })
      ]),
      // All achievements
      prisma.achievement.findMany({ orderBy: { createdAt: 'asc' } }),
      // User's unlocked achievements
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true }
      })
    ]);

    const [tasksCompleted, reflectionsWritten, streak, latestTask] = userStats;
    const unlockedIds = new Set(unlockedAchievements.map(ua => ua.achievementId));

    // Calculate achievement progress
    const achievementProgress = achievements.map(achievement => {
      const isUnlocked = unlockedIds.has(achievement.id);
      let current = 0;
      let target = 0;

      // Calculate current progress based on achievement type
      switch (achievement.code) {
        case 'first_task':
        case 'tasks_10':
        case 'tasks_100':
          current = tasksCompleted;
          target = achievement.code === 'first_task' ? 1 : 
                  achievement.code === 'tasks_10' ? 10 : 100;
          break;
        case 'first_reflection':
        case 'reflections_10':
        case 'reflections_100':
          current = reflectionsWritten;
          target = achievement.code === 'first_reflection' ? 1 :
                  achievement.code === 'reflections_10' ? 10 : 100;
          break;
        case 'streak_3':
        case 'streak_7':
        case 'streak_30':
          current = streak?.count || 0;
          target = achievement.code === 'streak_3' ? 3 :
                  achievement.code === 'streak_7' ? 7 : 30;
          break;
        case 'night_owl':
        case 'early_bird':
          // Time-based achievements
          if (isUnlocked) {
            current = 1;
            target = 1;
          }
          break;
      }

      return {
        ...achievement,
        current,
        target,
        unlocked: isUnlocked,
        progressPercent: target > 0 ? Math.min(100, (current / target) * 100) : 0
      };
    });

    // Generate AI suggestions
    const suggestions = generateAchievementSuggestions(achievementProgress, {
      tasksCompleted,
      reflectionsWritten,
      streakCount: streak?.count || 0,
      longestStreak: streak?.longest || 0,
      latestCompletionAt: latestTask?.updatedAt || null
    });

    return NextResponse.json({
      suggestions,
      userStats: {
        tasksCompleted,
        reflectionsWritten,
        streakCount: streak?.count || 0,
        longestStreak: streak?.longest || 0
      }
    });

  } catch (error) {
    console.error('Error generating achievement suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Generates intelligent achievement suggestions based on user patterns
 */
function generateAchievementSuggestions(
  achievements: AchievementWithProgress[],
  userStats: {
    tasksCompleted: number;
    reflectionsWritten: number;
    streakCount: number;
    longestStreak: number;
    latestCompletionAt: Date | null;
  }
) {
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  if (lockedAchievements.length === 0) {
    return {
      nextBest: null,
      dominoEffects: [],
      patterns: [],
      recommendations: []
    };
  }

  // Analyze domino effects (achievements that unlock others)
  const dominoEffects = analyzeDominoEffects(lockedAchievements, userStats);
  
  // Identify user patterns
  const patterns = analyzeUserPatterns(achievements, userStats);
  
  // Generate specific recommendations
  const recommendations = generateRecommendations(lockedAchievements, userStats, patterns);
  
  // Find the next best achievement
  const nextBest = findNextBestAchievement(lockedAchievements, userStats, dominoEffects);

    return {
      nextBest,
      dominoEffects,
      patterns,
      recommendations
    };
}

/**
 * Analyzes which achievements can unlock others (domino effect)
 */
function analyzeDominoEffects(achievements: AchievementWithProgress[], userStats: { tasksCompleted: number; reflectionsWritten: number; streakCount: number; longestStreak: number; latestCompletionAt: Date | null; }) {
  const effects = [];
  
  // Task-based domino effects
  if (userStats.tasksCompleted === 0) {
    effects.push({
      trigger: 'first_task',
      unlocks: ['tasks_10', 'tasks_100'],
      description: 'Completing your first task starts the task achievement chain'
    });
  }
  
  // Reflection-based domino effects
  if (userStats.reflectionsWritten === 0) {
    effects.push({
      trigger: 'first_reflection',
      unlocks: ['reflections_10', 'reflections_100'],
      description: 'Writing your first reflection starts the reflection achievement chain'
    });
  }
  
  // Streak-based domino effects
  if (userStats.streakCount === 0) {
    effects.push({
      trigger: 'streak_3',
      unlocks: ['streak_7', 'streak_30'],
      description: 'Building a 3-day streak starts the streak achievement chain'
    });
  }
  
  return effects;
}

/**
 * Analyzes user behavior patterns
 */
function analyzeUserPatterns(achievements: AchievementWithProgress[], userStats: { tasksCompleted: number; reflectionsWritten: number; streakCount: number; longestStreak: number; latestCompletionAt: Date | null; }) {
  const patterns = [];
  
  // Task completion pattern
  if (userStats.tasksCompleted > 0) {
    patterns.push({
      type: 'task_focused',
      strength: Math.min(100, (userStats.tasksCompleted / 10) * 100),
      description: 'User is actively completing tasks'
    });
  }
  
  // Reflection pattern
  if (userStats.reflectionsWritten > 0) {
    patterns.push({
      type: 'reflection_focused',
      strength: Math.min(100, (userStats.reflectionsWritten / 5) * 100),
      description: 'User is engaging in self-reflection'
    });
  }
  
  // Consistency pattern
  if (userStats.streakCount > 0) {
    patterns.push({
      type: 'consistent',
      strength: Math.min(100, (userStats.streakCount / 7) * 100),
      description: 'User maintains consistent daily activity'
    });
  }
  
  return patterns;
}

/**
 * Generates specific recommendations based on analysis
 */
function generateRecommendations(achievements: AchievementWithProgress[], userStats: { tasksCompleted: number; reflectionsWritten: number; streakCount: number; longestStreak: number; latestCompletionAt: Date | null; }, patterns: { type: string; strength: number; description: string; }[]) {
  const recommendations = [];
  
  // Quick wins (achievements close to completion)
  const quickWins = achievements.filter(a => {
    if (!a.target || a.target === 0) return false;
    const remaining = a.target - a.current;
    return remaining <= 2 && remaining > 0;
  });
  
  if (quickWins.length > 0) {
    recommendations.push({
      type: 'quick_win',
      achievement: quickWins[0],
      reason: `Only ${quickWins[0].target - quickWins[0].current} more to unlock!`,
      priority: 'high'
    });
  }
  
  // Pattern-based recommendations
  const taskPattern = patterns.find(p => p.type === 'task_focused');
  if (taskPattern && taskPattern.strength > 50) {
    const taskAchievement = achievements.find(a => a.code.startsWith('tasks') && !a.unlocked);
    if (taskAchievement) {
      recommendations.push({
        type: 'pattern_match',
        achievement: taskAchievement,
        reason: 'You\'re already completing tasks - keep the momentum going!',
        priority: 'medium'
      });
    }
  }
  
  // Beginner recommendations
  if (userStats.tasksCompleted === 0) {
    const firstTask = achievements.find(a => a.code === 'first_task');
    if (firstTask) {
      recommendations.push({
        type: 'beginner',
        achievement: firstTask,
        reason: 'Start your journey by completing your first task',
        priority: 'high'
      });
    }
  }
  
  return recommendations;
}

/**
 * Finds the next best achievement using strategic scoring
 */
function findNextBestAchievement(achievements: AchievementWithProgress[], userStats: { tasksCompleted: number; reflectionsWritten: number; streakCount: number; longestStreak: number; latestCompletionAt: Date | null; }, dominoEffects: { trigger: string; unlocks: string[]; description: string; }[]) {
  if (achievements.length === 0) return null;
  
  // Score each achievement
  const scored = achievements.map(achievement => {
    let score = 0;
    
    // Progress score (0-40 points)
    if (achievement.target > 0) {
      const progressPercent = (achievement.current / achievement.target) * 100;
      score += Math.min(40, progressPercent * 0.4);
    }
    
    // Difficulty score (0-30 points) - easier = higher score
    const difficultyMap: Record<string, number> = {
      'first_task': 30,
      'first_reflection': 30,
      'tasks_10': 25,
      'reflections_10': 25,
      'streak_3': 25,
      'streak_7': 20,
      'tasks_100': 15,
      'reflections_100': 15,
      'streak_30': 15
    };
    score += difficultyMap[achievement.code] ?? 15;
    
    // Category priority (0-20 points)
    const categoryMap: Record<string, number> = {
      'TASK': 20,
      'STREAK': 15,
      'REFLECTION': 10,
      'OTHER': 5
    };
    score += categoryMap[achievement.category] ?? 5;
    
    // Domino effect bonus (0-10 points)
    const hasDominoEffect = dominoEffects.some(effect => 
      effect.unlocks.includes(achievement.code)
    );
    if (hasDominoEffect) {
      score += 10;
    }
    
    return { ...achievement, score };
  });
  
  // Sort by score and return the best one
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}
