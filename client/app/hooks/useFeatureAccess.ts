/**
 * Hooks for client-side feature and plan access.
 *
 * Provides:
 * - `useFeatureAccess`: Derives plan, developer status, and convenience checks for feature flags.
 * - `usePlanInfo`: Exposes current plan and features unlocked by upgrading.
 */
"use client";
import { useSession } from "next-auth/react";
import { 
  hasFeatureAccess, 
  getUserFeatures, 
  getEffectivePlan,
  isDevUser,
  getUpgradeFeatures,
  type UserPlan, 
  type Feature 
} from "@/lib/features";

/**
 * Hook to check feature access for the current user.
 *
 * Uses `next-auth` client session to infer the user's plan and email, then
 * provides helpers for feature checks and convenience booleans for common features.
 */
export function useFeatureAccess() {
  const { data: session } = useSession();
  
  // Derive user plan from session, defaulting to "free" if not set
  const userPlan = (session?.user?.plan as UserPlan) || "free";
  const userEmail = session?.user?.email;
  
  // Create a feature access checker using the derived plan and email
  const hasAccess = (feature: Feature): boolean => {
    return hasFeatureAccess(userPlan, feature, userEmail);
  };
  
  // Determine if the user is a developer based on their email
  const isDeveloper = isDevUser(userEmail);
  // Get the effective plan, considering any overrides or promotions
  const effectivePlan = getEffectivePlan(userPlan, userEmail);
  // Get the features available to the user based on their plan and email
  const availableFeatures = getUserFeatures(userPlan, userEmail);
  // Get the features that would be unlocked by upgrading to the next plan tier
  const upgradeFeatures = getUpgradeFeatures(userPlan);
  
  return {
    // User info
    userPlan,
    effectivePlan,
    isDeveloper,
    
    // Feature checking
    hasAccess,
    availableFeatures,
    upgradeFeatures,
    
    // Convenience methods for common features
    canUseAnalytics: hasAccess("analytics"),
    canUseAchievements: hasAccess("achievements"),
    canUseAI: hasAccess("ai-assistant"),
    canExportData: hasAccess("export-data"),
    canAccessAdmin: hasAccess("admin-panel"),
  };
}

/**
 * Hook to get plan metadata and upgrade info.
 *
 * Returns current plan as derived from session and which features would be
 * unlocked by upgrading to the next plan tier.
 */
export function usePlanInfo() {
  const { data: session } = useSession();
  // Derive user plan from session, defaulting to "free" if not set
  const userPlan = (session?.user?.plan as UserPlan) || "free";
  
  return {
    currentPlan: userPlan,
    // Get the features that would be unlocked by upgrading to the next plan tier
    upgradeFeatures: getUpgradeFeatures(userPlan),
  };
}