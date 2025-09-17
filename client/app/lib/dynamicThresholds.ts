/**
 * Dynamic Progress Threshold Adjustment Service
 * 
 * This service analyzes user behavior patterns and dynamically adjusts achievement
 * progress thresholds to optimize user engagement and completion rates.
 * 
 * Features:
 * - Usage pattern analysis
 * - Adaptive difficulty scaling
 * - Engagement optimization
 * - Personalized thresholds
 */

export interface UserBehaviorData {
  tasksCompleted: number;
  reflectionsWritten: number;
  streakCount: number;
  longestStreak: number;
  averageTasksPerDay: number;
  averageReflectionsPerWeek: number;
  completionRate: number;
  lastActiveDate: Date;
  accountAge: number; // days since registration
}

export interface ThresholdAdjustment {
  achievementCode: string;
  originalThreshold: number;
  adjustedThreshold: number;
  adjustmentReason: string;
  confidence: number; // 0-1, how confident we are in this adjustment
}

export class DynamicThresholdService {
  
  /**
   * Analyzes user behavior and suggests threshold adjustments
   * 
   * @param userBehavior - Current user behavior data
   * @param currentThresholds - Current achievement thresholds
   * @returns Array of suggested threshold adjustments
   */
  static analyzeAndAdjustThresholds(
    userBehavior: UserBehaviorData,
    currentThresholds: Record<string, number>
  ): ThresholdAdjustment[] {
    const adjustments: ThresholdAdjustment[] = [];

    // Analyze each achievement type
    Object.entries(currentThresholds).forEach(([achievementCode, currentThreshold]) => {
      const adjustment = this.analyzeAchievementThreshold(
        achievementCode,
        currentThreshold,
        userBehavior
      );
      
      if (adjustment) {
        adjustments.push(adjustment);
      }
    });

    return adjustments.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyzes a specific achievement threshold for potential adjustment
   */
  private static analyzeAchievementThreshold(
    achievementCode: string,
    currentThreshold: number,
    userBehavior: UserBehaviorData
  ): ThresholdAdjustment | null {
    
    // Skip adjustments for very low thresholds (already easy enough)
    if (currentThreshold <= 3) {
      return null;
    }

    let adjustedThreshold = currentThreshold;
    let adjustmentReason = '';
    let confidence = 0;

    // Task-based achievements
    if (achievementCode.startsWith('tasks_')) {
      const adjustment = this.adjustTaskThreshold(achievementCode, currentThreshold, userBehavior);
      if (adjustment) {
        adjustedThreshold = adjustment.threshold;
        adjustmentReason = adjustment.reason;
        confidence = adjustment.confidence;
      }
    }
    
    // Streak-based achievements
    else if (achievementCode.startsWith('streak_')) {
      const adjustment = this.adjustStreakThreshold(achievementCode, currentThreshold, userBehavior);
      if (adjustment) {
        adjustedThreshold = adjustment.threshold;
        adjustmentReason = adjustment.reason;
        confidence = adjustment.confidence;
      }
    }
    
    // Reflection-based achievements
    else if (achievementCode.startsWith('reflections_')) {
      const adjustment = this.adjustReflectionThreshold(achievementCode, currentThreshold, userBehavior);
      if (adjustment) {
        adjustedThreshold = adjustment.threshold;
        adjustmentReason = adjustment.reason;
        confidence = adjustment.confidence;
      }
    }

    // Only return adjustment if it's meaningful (at least 20% change and high confidence)
    const changePercent = Math.abs(adjustedThreshold - currentThreshold) / currentThreshold;
    if (changePercent >= 0.2 && confidence >= 0.7) {
      return {
        achievementCode,
        originalThreshold: currentThreshold,
        adjustedThreshold,
        adjustmentReason,
        confidence
      };
    }

    return null;
  }

  /**
   * Adjusts task-based achievement thresholds
   */
  private static adjustTaskThreshold(
    achievementCode: string,
    currentThreshold: number,
    userBehavior: UserBehaviorData
  ): { threshold: number; reason: string; confidence: number } | null {
    
    const { averageTasksPerDay, completionRate, accountAge } = userBehavior;
    
    // If user is struggling with task completion
    if (averageTasksPerDay < 0.5 && completionRate < 0.3) {
      // Reduce threshold by 30-50% for struggling users
      const reductionFactor = accountAge < 7 ? 0.5 : 0.7; // New users get more help
      const newThreshold = Math.max(1, Math.round(currentThreshold * reductionFactor));
      
      return {
        threshold: newThreshold,
        reason: `Reduced threshold from ${currentThreshold} to ${newThreshold} based on low task completion rate (${(completionRate * 100).toFixed(1)}%)`,
        confidence: 0.8
      };
    }
    
    // If user is highly active, consider increasing threshold for engagement
    if (averageTasksPerDay > 2 && completionRate > 0.8 && accountAge > 30) {
      const increaseFactor = 1.2; // 20% increase
      const newThreshold = Math.round(currentThreshold * increaseFactor);
      
      return {
        threshold: newThreshold,
        reason: `Increased threshold from ${currentThreshold} to ${newThreshold} to maintain engagement for active user (${averageTasksPerDay.toFixed(1)} tasks/day)`,
        confidence: 0.6
      };
    }
    
    return null;
  }

  /**
   * Adjusts streak-based achievement thresholds
   */
  private static adjustStreakThreshold(
    achievementCode: string,
    currentThreshold: number,
    userBehavior: UserBehaviorData
  ): { threshold: number; reason: string; confidence: number } | null {
    
    const { longestStreak, averageTasksPerDay, accountAge } = userBehavior;
    
    // If user has never achieved a long streak
    if (longestStreak < currentThreshold * 0.5 && accountAge > 14) {
      // Reduce threshold to help user build momentum
      const reductionFactor = 0.6;
      const newThreshold = Math.max(2, Math.round(currentThreshold * reductionFactor));
      
      return {
        threshold: newThreshold,
        reason: `Reduced streak threshold from ${currentThreshold} to ${newThreshold} to help build momentum (longest streak: ${longestStreak} days)`,
        confidence: 0.7
      };
    }
    
    // If user is very consistent, increase threshold
    if (longestStreak > currentThreshold * 1.5 && averageTasksPerDay > 1) {
      const increaseFactor = 1.3;
      const newThreshold = Math.round(currentThreshold * increaseFactor);
      
      return {
        threshold: newThreshold,
        reason: `Increased streak threshold from ${currentThreshold} to ${newThreshold} for consistent user (longest streak: ${longestStreak} days)`,
        confidence: 0.6
      };
    }
    
    return null;
  }

  /**
   * Adjusts reflection-based achievement thresholds
   */
  private static adjustReflectionThreshold(
    achievementCode: string,
    currentThreshold: number,
    userBehavior: UserBehaviorData
  ): { threshold: number; reason: string; confidence: number } | null {
    
    const { averageReflectionsPerWeek, reflectionsWritten } = userBehavior;
    
    // If user rarely writes reflections
    if (averageReflectionsPerWeek < 0.5 && reflectionsWritten < currentThreshold * 0.3) {
      // Significantly reduce threshold for reflection-averse users
      const reductionFactor = 0.4;
      const newThreshold = Math.max(1, Math.round(currentThreshold * reductionFactor));
      
      return {
        threshold: newThreshold,
        reason: `Reduced reflection threshold from ${currentThreshold} to ${newThreshold} to encourage reflection practice (${averageReflectionsPerWeek.toFixed(1)} reflections/week)`,
        confidence: 0.8
      };
    }
    
    // If user is very reflective, increase threshold
    if (averageReflectionsPerWeek > 3 && reflectionsWritten > currentThreshold * 0.8) {
      const increaseFactor = 1.4;
      const newThreshold = Math.round(currentThreshold * increaseFactor);
      
      return {
        threshold: newThreshold,
        reason: `Increased reflection threshold from ${currentThreshold} to ${newThreshold} for reflective user (${averageReflectionsPerWeek.toFixed(1)} reflections/week)`,
        confidence: 0.7
      };
    }
    
    return null;
  }

  /**
   * Calculates user behavior metrics from raw data
   */
  static calculateUserBehavior(
    rawData: {
      tasksCompleted: number;
      reflectionsWritten: number;
      streakCount: number;
      longestStreak: number;
      lastActiveDate: Date;
      registrationDate: Date;
      totalDays: number;
    }
  ): UserBehaviorData {
    const accountAge = Math.max(1, Math.floor((Date.now() - rawData.registrationDate.getTime()) / (1000 * 60 * 60 * 24)));
    const activeDays = Math.max(1, rawData.totalDays);
    
    return {
      tasksCompleted: rawData.tasksCompleted,
      reflectionsWritten: rawData.reflectionsWritten,
      streakCount: rawData.streakCount,
      longestStreak: rawData.longestStreak,
      averageTasksPerDay: rawData.tasksCompleted / activeDays,
      averageReflectionsPerWeek: (rawData.reflectionsWritten / activeDays) * 7,
      completionRate: rawData.tasksCompleted > 0 ? Math.min(1, rawData.tasksCompleted / (rawData.tasksCompleted + 10)) : 0, // Estimate
      lastActiveDate: rawData.lastActiveDate,
      accountAge
    };
  }

  /**
   * Validates threshold adjustments before applying
   */
  static validateAdjustments(adjustments: ThresholdAdjustment[]): ThresholdAdjustment[] {
    return adjustments.filter(adjustment => {
      // Ensure thresholds don't go below 1
      if (adjustment.adjustedThreshold < 1) {
        return false;
      }
      
      // Ensure confidence is high enough
      if (adjustment.confidence < 0.6) {
        return false;
      }
      
      // Ensure change is meaningful (at least 20% or absolute change of 2)
      const changePercent = Math.abs(adjustment.adjustedThreshold - adjustment.originalThreshold) / adjustment.originalThreshold;
      const absoluteChange = Math.abs(adjustment.adjustedThreshold - adjustment.originalThreshold);
      
      return changePercent >= 0.2 || absoluteChange >= 2;
    });
  }
}

/**
 * Utility function to get dynamic threshold adjustments
 * This is the main export that components should use
 */
export function getDynamicThresholdAdjustments(
  userBehavior: UserBehaviorData,
  currentThresholds: Record<string, number>
): ThresholdAdjustment[] {
  const adjustments = DynamicThresholdService.analyzeAndAdjustThresholds(
    userBehavior,
    currentThresholds
  );
  
  return DynamicThresholdService.validateAdjustments(adjustments);
}
