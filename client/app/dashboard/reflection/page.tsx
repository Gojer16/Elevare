"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ReflectionJournal } from "../components/Reflection/ReflectionJournal";
import { EnhancedReflectionModal } from "../components/Reflection/EnhancedReflectionModal";
import { DashboardBackground } from "../components/UI/DashboardBackground";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Reflection {
  id: string;
  content: string;
  createdAt: string;
  mood?: 'great' | 'good' | 'okay' | 'challenging';
  tags?: string[];
  wordCount?: number;
}

interface ReflectionStats {
  total: number;
  thisWeek: number;
  averageLength: number;
  longestStreak: number;
}

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<ReflectionStats>({
    total: 0,
    thisWeek: 0,
    averageLength: 0,
    longestStreak: 0
  });
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  const loadReflections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reflection?limit=50');
      if (response.ok) {
        const data = await response.json();
        const reflectionsData = data.reflections || [];
        
        // Process reflections with additional data
        const processedReflections = reflectionsData.map((reflection: any) => ({
          ...reflection,
          wordCount: reflection.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length,
          tags: extractTags(reflection.content)
        }));
        
        setReflections(processedReflections);
        calculateStats(processedReflections);
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTags = (content: string): string[] => {
    // Simple tag extraction based on keywords
    const keywords = ['grateful', 'learned', 'challenge', 'growth', 'insight', 'goal', 'success', 'difficult'];
    return keywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).slice(0, 3);
  };

  const calculateStats = (reflectionsData: Reflection[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekReflections = reflectionsData.filter(r => 
      new Date(r.createdAt) >= weekAgo
    );
    
    const totalWords = reflectionsData.reduce((sum, r) => sum + (r.wordCount || 0), 0);
    const averageLength = reflectionsData.length > 0 ? Math.round(totalWords / reflectionsData.length) : 0;
    
    setStats({
      total: reflectionsData.length,
      thisWeek: thisWeekReflections.length,
      averageLength,
      longestStreak: 0 // TODO: Calculate actual streak
    });
  };

  useEffect(() => {
    loadReflections();
  }, []);

  const handleSaveReflection = async (content: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          conversationId: null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reflection');
      }

      // Reload reflections to show the new one
      await loadReflections();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving reflection:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <DashboardBackground variant="archive" />
        <LoadingSpinner message="Loading your reflections..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <DashboardBackground variant="archive" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
            Reflection Space
            </h1>
          </div>
          
          <p className="text-lg text-[var(--color-foreground)]/70 mb-8 max-w-2xl mx-auto">
          Your personal space for growth, insights, and self-discovery. 
          Reflect on your journey and capture the wisdom you gain along the way.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                         border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-[var(--color-foreground)]/70">Total Reflections</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                         border border-green-200 dark:border-green-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.thisWeek}</div>
              <div className="text-sm text-[var(--color-foreground)]/70">This Week</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                         border border-purple-200 dark:border-purple-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageLength}</div>
              <div className="text-sm text-[var(--color-foreground)]/70">Avg Words</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 
                         border border-orange-200 dark:border-orange-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.longestStreak}</div>
              <div className="text-sm text-[var(--color-foreground)]/70">Best Streak</div>
            </motion.div>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                       hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white rounded-2xl 
                       transition-all duration-200 font-semibold text-lg"
          >
            <Plus className="w-6 h-6" />
            New Reflection
          </motion.button>
        </motion.div>

        {/* Reflection Journal */}
        <ReflectionJournal 
          reflections={reflections}
          onReflectionSelect={setSelectedReflection}
        />

        {/* Enhanced Reflection Modal */}
        <EnhancedReflectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveReflection}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}