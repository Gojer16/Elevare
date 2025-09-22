"use client";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Target } from "lucide-react";
import { FeatureGate, DevOnly } from "@/components/FeatureGate";
import { FEATURES } from "@/lib/features";

const SAMPLE_ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first task",
    icon: Target,
    unlocked: true,
    progress: 100,
  },
  {
    id: 2,
    title: "Week Warrior",
    description: "Complete tasks for 7 days straight",
    icon: Zap,
    unlocked: true,
    progress: 100,
  },
  {
    id: 3,
    title: "Reflection Master",
    description: "Write 10 thoughtful reflections",
    icon: Star,
    unlocked: false,
    progress: 60,
  },
  {
    id: 4,
    title: "Consistency King",
    description: "Maintain a 30-day streak",
    icon: Trophy,
    unlocked: false,
    progress: 40,
  },
];

export function AchievementsSection() {
  return (
    <FeatureGate feature={FEATURES.ACHIEVEMENTS}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
              <p className="text-sm text-gray-600">Celebrate your progress</p>
            </div>
          </div>
          
          <DevOnly>
            <div className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              DEV ONLY
            </div>
          </DevOnly>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_ACHIEVEMENTS.map((achievement) => {
            const IconComponent = achievement.icon;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: achievement.id * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gray-300'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </FeatureGate>
  );
}