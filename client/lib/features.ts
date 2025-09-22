/**
 * Feature access control system.
 *
 * Provides:
 * - Plan and feature type definitions used across the app.
 * - Central registry of feature keys (`FEATURES`).
 * - Plan-to-features mapping (`PLAN_FEATURES`) and plan metadata for UI.
 * - Helper utilities to compute effective access (including developer overrides).
 * - Utilities to suggest upgrades and enumerate unlocked features.
 */

// Subscription plan identifier used across the app.
/**
 * Type representing the different subscription plans available.
 */
export type UserPlan = "free" | "premium" | "pro";

/**
 * Canonical registry of feature keys used in routing, gating, and UI labels.
 *
 * Grouped by intended plan, but any feature can be mapped to plans using
 * `PLAN_FEATURES`. Developer-only features are available to dev users only.
 */
export const FEATURES = {
  // Core features
  TASKS: "tasks",
  BASIC_DASHBOARD: "basic-dashboard",
  
  // Premium features
  ANALYTICS: "analytics",
  ADVANCED_STATS: "advanced-stats",
  EXPORT_DATA: "export-data",
  
  // Pro features
  ACHIEVEMENTS: "achievements",
  AI_ASSISTANT: "ai-assistant",
  CUSTOM_THEMES: "custom-themes",
  PRIORITY_SUPPORT: "priority-support",
  
  // Developer-only features
  ADMIN_PANEL: "admin-panel",
  FEATURE_FLAGS: "feature-flags",
  DEBUG_TOOLS: "debug-tools",
} as const;

/**
 * Union type of all feature keys.
 */
export type Feature = typeof FEATURES[keyof typeof FEATURES];

/**
 * Feature mapping by subscription tier.
 *
 * Controls which features are available for each plan. This is the primary
 * place to update when introducing new features or adjusting plan benefits.
 */
export const PLAN_FEATURES: Record<UserPlan, Feature[]> = {
  free: [
    FEATURES.TASKS,
    FEATURES.BASIC_DASHBOARD,
  ],
  premium: [
    FEATURES.TASKS,
    FEATURES.BASIC_DASHBOARD,
    FEATURES.ANALYTICS,
    FEATURES.ADVANCED_STATS,
    FEATURES.EXPORT_DATA,
  ],
  pro: [
    FEATURES.TASKS,
    FEATURES.BASIC_DASHBOARD,
    FEATURES.ANALYTICS,
    FEATURES.ADVANCED_STATS,
    FEATURES.EXPORT_DATA,
    FEATURES.ACHIEVEMENTS,
    FEATURES.AI_ASSISTANT,
    FEATURES.CUSTOM_THEMES,
    FEATURES.PRIORITY_SUPPORT,
  ],
};

/**
 * Plan metadata for UI display.
 *
 * Useful for pricing pages, badges, and contextual messaging.
 */
export const PLAN_METADATA = {
  free: {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    color: "gray",
    maxTasks: 10,
    maxReflections: 50,
  },
  premium: {
    name: "Premium",
    price: "$9/month",
    description: "For serious productivity enthusiasts",
    color: "blue",
    maxTasks: 100,
    maxReflections: 500,
  },
  pro: {
    name: "Pro",
    price: "$19/month",
    description: "For power users and teams",
    color: "purple",
    maxTasks: -1, // unlimited
    maxReflections: -1, // unlimited
  },
} as const;

/**
 * Developer email allowlist.
 *
 * Replace with your actual engineering/admin emails. Dev users have full
 * access, including developer-only features and effective plan upgrades.
 */
const DEVELOPER_EMAILS = [
  "your@email.com", // Replace with your actual email
  "admin@elevare.app",
  "dev@elevare.app",
];

/**
 * Check if a plan includes a specific feature.
 *
 * This does not apply developer overrides; use `hasFeatureAccess` for the more
 * permissive check that includes dev allowlist.
 */
export function hasAccess(userPlan: UserPlan, feature: Feature): boolean {
  return PLAN_FEATURES[userPlan].includes(feature);
}

/**
 * Determine whether a given email belongs to a developer user.
 *
 * Developer users have access to dev-only features and are granted the highest
 * effective plan tier where applicable.
 */
export function isDevUser(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  return DEVELOPER_EMAILS.includes(userEmail.toLowerCase());
}

/**
 * Compute the effective plan for a user.
 *
 * Developers are treated as having the highest tier (`"pro"`). Non-developers
 * retain their actual plan.
 */
export function getEffectivePlan(userPlan: UserPlan, userEmail?: string | null): UserPlan {
  if (isDevUser(userEmail)) return "pro";
  return userPlan;
}

/**
 * Check whether the user has access to a feature including developer override.
 */
export function hasFeatureAccess(
  userPlan: UserPlan, 
  feature: Feature, 
  userEmail?: string | null
): boolean {
  // Developers have access to everything
  if (isDevUser(userEmail)) return true;
  
  // Regular plan-based access
  return hasAccess(userPlan, feature);
}

/**
 * Get the complete set of features available to a user.
 *
 * Developer users receive all plan features plus developer-only features.
 */
export function getUserFeatures(userPlan: UserPlan, userEmail?: string | null): Feature[] {
  const effectivePlan = getEffectivePlan(userPlan, userEmail);
  
  // Developers get all features including dev-only ones
  if (isDevUser(userEmail)) {
    return [
      ...PLAN_FEATURES[effectivePlan],
      FEATURES.ADMIN_PANEL,
      FEATURES.FEATURE_FLAGS,
      FEATURES.DEBUG_TOOLS,
    ];
  }
  
  return PLAN_FEATURES[effectivePlan];
}

/**
 * Get the next plan tier for upgrade suggestions.
 */
export function getNextPlan(currentPlan: UserPlan): UserPlan | null {
  switch (currentPlan) {
    case "free":
      return "premium";
    case "premium":
      return "pro";
    case "pro":
      return null; // Already at highest tier
    default:
      return null;
  }
}

/**
 * Get the list of features that would be unlocked by upgrading to the next plan.
 */
export function getUpgradeFeatures(currentPlan: UserPlan): Feature[] {
  const nextPlan = getNextPlan(currentPlan);
  if (!nextPlan) return [];
  
  const currentFeatures = PLAN_FEATURES[currentPlan];
  const nextFeatures = PLAN_FEATURES[nextPlan];
  
  return nextFeatures.filter(feature => !currentFeatures.includes(feature));
}