import { AchievementLite, AchievementProgress } from '@/app/components/achievements/AchievementCard';

export interface NextBestAchievementData {
  achievement: AchievementLite;
  progress: AchievementProgress;
  priority: 'high' | 'medium' | 'low';
  suggestion?: string;
  reason: string;
}

/**
 * Achievement Priority Scoring System
 * 
 * This system analyzes user progress and determines which achievement should be prioritized next.
 * It considers multiple factors to provide the most relevant and achievable target.
 */
export class NextBestAchievementService {
  
  /**
   * Determines the next best achievement based on user progress and strategic factors
   * 
   * @param achievements - Array of all achievements with their progress data
   * @param userStats - Current user statistics (tasks completed, streak, etc.)
   * @returns The most relevant achievement to focus on next
   */
  static getNextBestAchievement(
    achievements: Array<AchievementLite & { progress: AchievementProgress }>,
    userStats?: {
      tasksCompleted: number;
      reflectionsWritten: number;
      streakCount: number;
      longestStreak: number;
    }
  ): NextBestAchievementData | null {
    
    // Filter out already unlocked achievements
    const lockedAchievements = achievements.filter(a => !a.progress.unlocked);
    
    if (lockedAchievements.length === 0) {
      return null; // All achievements unlocked
    }

    // Score each achievement based on multiple factors
    const scoredAchievements = lockedAchievements.map(achievement => {
      const score = this.calculateAchievementScore(achievement, userStats);
      return {
        ...achievement,
        score,
        priority: this.determinePriority(score),
        reason: this.getReason(achievement, score, userStats)
      };
    });

    // Sort by score (highest first) and return the best one
    scoredAchievements.sort((a, b) => b.score - a.score);
    const best = scoredAchievements[0];

    return {
      achievement: {
        id: best.id,
        code: best.code,
        title: best.title,
        description: best.description,
        icon: best.icon,
        category: best.category
      },
      progress: best.progress,
      priority: best.priority,
      reason: best.reason,
      suggestion: this.generateSuggestion(best, userStats)
    };
  }

  /**
   * Calculates a score for an achievement based on multiple strategic factors
   * 
   * Scoring factors:
   * - Progress percentage (closer to completion = higher score)
   * - Difficulty level (easier achievements = higher score)
   * - Category priority (TASK > STREAK > REFLECTION > OTHER)
   * - Momentum factor (achievements that build on current activity)
   * - Domino effect (achievements that unlock others)
   */
  private static calculateAchievementScore(
    achievement: AchievementLite & { progress: AchievementProgress },
    userStats?: {
      tasksCompleted: number;
      reflectionsWritten: number;
      streakCount: number;
      longestStreak: number;
    }
  ): number {
    const { progress, category, code } = achievement;
    let score = 0;

    // 1. Progress percentage (0-40 points)
    if (progress.target && progress.target > 0) {
      const progressPercent = (progress.current / progress.target) * 100;
      score += Math.min(40, progressPercent * 0.4);
    }

    // 2. Difficulty level (0-30 points) - easier achievements get higher scores
    const difficultyScore = this.getDifficultyScore(code);
    score += difficultyScore;

    // 3. Category priority (0-20 points)
    const categoryScore = this.getCategoryScore(category);
    score += categoryScore;

    // 4. Momentum factor (0-10 points) - achievements that align with current activity
    const momentumScore = this.getMomentumScore(achievement, userStats);
    score += momentumScore;

    return Math.round(score);
  }

  /**
   * Determines difficulty score based on achievement code
   * Easier achievements get higher scores to encourage quick wins
   */
  private static getDifficultyScore(code: string): number {
    const difficultyMap: Record<string, number> = {
      // Very easy (30 points)
      'first_task': 30,
      'first_reflection': 30,
      
      // Easy (25 points)
      'tasks_10': 25,
      'reflections_10': 25,
      'streak_3': 25,
      
      // Medium (20 points)
      'streak_7': 20,
      'night_owl': 20,
      'early_bird': 20,
      
      // Hard (15 points)
      'tasks_100': 15,
      'reflections_100': 15,
      'streak_30': 15,
    };

    return difficultyMap[code] || 15; // Default to medium difficulty
  }

  /**
   * Determines category priority score
   * TASK achievements are prioritized as they're most actionable
   */
  private static getCategoryScore(category: string): number {
    const categoryMap: Record<string, number> = {
      'TASK': 20,        // Highest priority - most actionable
      'STREAK': 15,      // Medium priority - builds habits
      'REFLECTION': 10,  // Lower priority - more passive
      'OTHER': 5,        // Lowest priority - special cases
    };

    return categoryMap[category] || 5;
  }

  /**
   * Calculates momentum score based on current user activity
   * Achievements that align with current behavior get bonus points
   */
  private static getMomentumScore(
    achievement: AchievementLite & { progress: AchievementProgress },
    userStats?: {
      tasksCompleted: number;
      reflectionsWritten: number;
      streakCount: number;
      longestStreak: number;
    }
  ): number {
    if (!userStats) return 0;

    const { code, progress } = achievement;
    let momentum = 0;

    // If user is actively completing tasks, prioritize task achievements
    if (code.startsWith('tasks') && userStats.tasksCompleted > 0) {
      momentum += 5;
    }

    // If user has a current streak, prioritize streak achievements
    if (code.startsWith('streak') && userStats.streakCount > 0) {
      momentum += 5;
    }

    // If user is writing reflections, prioritize reflection achievements
    if (code.startsWith('reflections') && userStats.reflectionsWritten > 0) {
      momentum += 5;
    }

    // Bonus for achievements that are very close to completion
    if (progress.target && progress.target > 0) {
      const remaining = progress.target - progress.current;
      if (remaining <= 2) {
        momentum += 5; // Urgency bonus
      }
    }

    return Math.min(10, momentum);
  }

  /**
   * Determines priority level based on calculated score
   */
  private static determinePriority(score: number): 'high' | 'medium' | 'low' {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Generates a human-readable reason for why this achievement was selected
   */
  private static getReason(
    achievement: AchievementLite & { progress: AchievementProgress },
    score: number,
    userStats?: {
      tasksCompleted: number;
      reflectionsWritten: number;
      streakCount: number;
      longestStreak: number;
    }
  ): string {
    const { code, progress } = achievement;
    
    if (progress.target && progress.target > 0) {
      const remaining = progress.target - progress.current;
      if (remaining <= 2) {
        return `Almost there! Just ${remaining} more to unlock.`;
      }
    }

    if (code === 'first_task' && userStats?.tasksCompleted === 0) {
      return 'Perfect starting point - complete your first task to get started!';
    }

    if (code === 'first_reflection' && userStats?.reflectionsWritten === 0) {
      return 'Great for building self-awareness - write your first reflection.';
    }

    if (code.startsWith('streak_3') && userStats?.streakCount === 0) {
      return 'Build momentum with a 3-day streak - consistency is key!';
    }

    if (code.startsWith('tasks_10') && userStats?.tasksCompleted < 10) {
      return 'You\'re making progress! Keep completing tasks to reach 10.';
    }

    return 'This achievement aligns well with your current activity patterns.';
  }

  /**
   * Generates AI-powered suggestions for achieving the target
   */
  private static generateSuggestion(
    achievement: AchievementLite & { progress: AchievementProgress }
  ): string {
    const { code, progress } = achievement;

    // Time-based achievements
    if (code === 'night_owl') {
      return 'Try completing a task between midnight and 5 AM to unlock this achievement.';
    }
    if (code === 'early_bird') {
      return 'Complete a task before 7 AM to unlock this achievement.';
    }

    // Task-based achievements
    if (code.startsWith('tasks')) {
      const remaining = progress.target ? progress.target - progress.current : 0;
      if (remaining > 0) {
        return `Break down your remaining ${remaining} tasks into smaller, manageable chunks. Try completing 1-2 tasks per day.`;
      }
    }

    // Streak-based achievements
    if (code.startsWith('streak')) {
      return 'Set a daily reminder to complete at least one task. Consistency is more important than perfection.';
    }

    // Reflection-based achievements
    if (code.startsWith('reflections')) {
      return 'Schedule 10-15 minutes daily for reflection. Use prompts like "What went well today?" or "What would I do differently?"';
    }

    return 'Focus on building consistent daily habits to unlock this achievement.';
  }
}

/**
 * Utility function to get the next best achievement
 * This is the main export that components should use
 */
export function getNextBestAchievement(
  achievements: Array<AchievementLite & { progress: AchievementProgress }>,
  userStats?: {
    tasksCompleted: number;
    reflectionsWritten: number;
    streakCount: number;
    longestStreak: number;
  }
): NextBestAchievementData | null {
  return NextBestAchievementService.getNextBestAchievement(achievements, userStats);
}
