"use client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Crown, Check, Sparkles, Zap } from "lucide-react";
import { PLAN_METADATA, FEATURES, getUpgradeFeatures } from "@/lib/features";
import { useFeatureAccess } from "@/app/hooks/useFeatureAccess";

const FEATURE_DESCRIPTIONS = {
  [FEATURES.ANALYTICS]: "Track your productivity patterns and insights",
  [FEATURES.ACHIEVEMENTS]: "Unlock badges and celebrate your progress",
  [FEATURES.AI_ASSISTANT]: "Get AI-powered task suggestions and coaching",
  [FEATURES.ADVANCED_STATS]: "Deep dive into your productivity metrics",
  [FEATURES.EXPORT_DATA]: "Export your data in multiple formats",
  [FEATURES.CUSTOM_THEMES]: "Personalize your dashboard appearance",
  [FEATURES.PRIORITY_SUPPORT]: "Get priority customer support",
};

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const requestedFeature = searchParams.get("feature");
  const fromPage = searchParams.get("from");
  
  const { userPlan, isDeveloper } = useFeatureAccess();
  
  const handleUpgrade = (plan: string) => {
    // TODO: Implement Stripe integration
    console.log(`Upgrading to ${plan}`);
    alert(`Upgrade to ${plan} - Integration with Stripe coming soon!`);
  };
  
  if (isDeveloper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Developer Access</h1>
          <p className="text-gray-600">You already have access to all features as a developer.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upgrade Your Experience
            </h1>
          </motion.div>
          
          {requestedFeature && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8"
            >
              <p className="text-blue-900">
                <strong>{FEATURE_DESCRIPTIONS[requestedFeature as keyof typeof FEATURE_DESCRIPTIONS]}</strong> requires a premium plan.
              </p>
              {fromPage && (
                <p className="text-sm text-blue-700 mt-1">
                  Upgrade now to access this feature and return to {fromPage}.
                </p>
              )}
            </motion.div>
          )}
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock powerful features to supercharge your productivity journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(PLAN_METADATA).map(([planKey, plan], index) => {
            const isCurrentPlan = planKey === userPlan;
            const isPremium = planKey !== "free";
            
            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl border-2 p-8 ${
                  planKey === "pro" 
                    ? "border-purple-500 transform scale-105" 
                    : "border-gray-200"
                } ${isCurrentPlan ? "ring-4 ring-blue-200" : ""}`}
              >
                {planKey === "pro" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {Object.values(FEATURES).map((feature) => {
                    const hasFeature = planKey === "free" 
                      ? ["tasks", "basic-dashboard"].includes(feature)
                      : planKey === "premium"
                      ? ["tasks", "basic-dashboard", "analytics", "advanced-stats", "export-data"].includes(feature)
                      : true; // pro has all features
                    
                    if (!FEATURE_DESCRIPTIONS[feature as keyof typeof FEATURE_DESCRIPTIONS]) return null;
                    
                    return (
                      <div key={feature} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          hasFeature ? "bg-green-100" : "bg-gray-100"
                        }`}>
                          {hasFeature ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          )}
                        </div>
                        <span className={hasFeature ? "text-gray-900" : "text-gray-400"}>
                          {FEATURE_DESCRIPTIONS[feature as keyof typeof FEATURE_DESCRIPTIONS]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleUpgrade(planKey)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    isCurrentPlan
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : planKey === "pro"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                      : isPremium
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Upgrade?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">
                Get deep insights into your productivity patterns and optimize your workflow.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Achievement System</h3>
              <p className="text-gray-600 text-sm">
                Stay motivated with badges, streaks, and progress celebrations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">
                Get personalized task suggestions and productivity coaching.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}