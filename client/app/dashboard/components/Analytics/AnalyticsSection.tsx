"use client";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Target } from "lucide-react";
import { FeatureGate } from "@/components/FeatureGate";
import { FEATURES } from "@/lib/features";

export function AnalyticsSection() {
  return (
    <FeatureGate feature={FEATURES.ANALYTICS}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-600">Track your productivity patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">87%</p>
            <p className="text-xs text-blue-700">+5% from last week</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Streak</span>
            </div>
            <p className="text-2xl font-bold text-green-600">12 days</p>
            <p className="text-xs text-green-700">Personal best!</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Focus Score</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">9.2/10</p>
            <p className="text-xs text-purple-700">Excellent focus</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Weekly Progress</h3>
          <div className="space-y-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </FeatureGate>
  );
}