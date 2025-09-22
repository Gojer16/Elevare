"use client";
/**
 * Upgrade call-to-action component used to prompt users to move to the next plan tier.
 *
 * Responsibilities:
 * - Presents upgrade messaging in different UI variants (card, banner, inline, modal placeholder).
 * - Optionally tailors copy towards a specific feature the user attempted to access.
 * - Surfaces price and plan details from `PLAN_METADATA` and next plan via `getNextPlan`.
 *
 * Note:
 * - The actual checkout/upgrade flow is not implemented here; see `handleUpgrade` TODO.
 */
import { motion } from "framer-motion";
import { Crown, Sparkles, ArrowRight, Lock } from "lucide-react";
import { Feature, PLAN_METADATA, getNextPlan } from "@/lib/features";
import { usePlanInfo } from "@/app/hooks/useFeatureAccess";

/**
 * Props for `UpgradeCTA`.
 *
 * - `feature` (optional): If provided, copy will reference the specific feature the user wanted.
 * - `variant`: Presentation style (default: `"card"`).
 * - `className`: Additional class names for container.
 */
interface UpgradeCTAProps {
  feature?: Feature;
  variant?: "card" | "banner" | "inline" | "modal";
  className?: string;
}

/**
 * Human-friendly descriptions for feature keys.
 * Used to generate contextual upgrade copy.
 */
const FEATURE_DESCRIPTIONS: Record<Feature, string> = {
  "analytics": "Track your productivity patterns and insights",
  "achievements": "Unlock badges and celebrate your progress",
  "ai-assistant": "Get AI-powered task suggestions and coaching",
  "advanced-stats": "Deep dive into your productivity metrics",
  "export-data": "Export your data in multiple formats",
  "custom-themes": "Personalize your dashboard appearance",
  "priority-support": "Get priority customer support",
  "admin-panel": "Access administrative features",
  "feature-flags": "Control feature rollouts",
  "debug-tools": "Access debugging and development tools",
  "tasks": "Create and manage your daily tasks",
  "basic-dashboard": "Access your basic productivity dashboard",
};

/**
 * Render an upgrade prompt tailored to the user's next available plan.
 */
export function UpgradeCTA({ 
  feature, 
  variant = "card", 
  className = "" 
}: UpgradeCTAProps) {
  const { currentPlan } = usePlanInfo();
  const nextPlan = getNextPlan(currentPlan);
  
  if (!nextPlan) {
    return null; // Already at highest tier
  }
  
  const nextPlanMeta = PLAN_METADATA[nextPlan];
  const featureDescription = feature ? FEATURE_DESCRIPTIONS[feature] : null;
  
  const handleUpgrade = () => {
  // TODO: Implement upgrade flow (Stripe checkout, billing portal, etc.)
    console.log(`Upgrading to ${nextPlan}`);
  };
  
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 text-sm text-gray-600 ${className}`}>
        <Lock className="w-4 h-4" />
        <span>
          {feature ? `${FEATURE_DESCRIPTIONS[feature]} - ` : ""}
          <button 
            onClick={handleUpgrade}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Upgrade to {nextPlanMeta.name}
          </button>
        </span>
      </div>
    );
  }
  
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {feature ? `Unlock ${FEATURE_DESCRIPTIONS[feature]}` : `Upgrade to ${nextPlanMeta.name}`}
              </p>
              <p className="text-sm text-gray-600">
                Get access to premium features starting at {nextPlanMeta.price}
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Upgrade
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }
  
  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {feature ? "Premium Feature" : `Upgrade to ${nextPlanMeta.name}`}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {featureDescription || `Unlock advanced features with ${nextPlanMeta.name}`}
      </p>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <Sparkles className="w-4 h-4" />
          <span>Starting at {nextPlanMeta.price}</span>
        </div>
      </div>
      
      <button
        onClick={handleUpgrade}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        Upgrade Now
        <ArrowRight className="w-4 h-4" />
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Cancel anytime • 30-day money-back guarantee
      </p>
    </motion.div>
  );
}