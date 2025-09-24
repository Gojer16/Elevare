"use client";
import { useState, useEffect, useCallback } from "react";
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
  tags?: string[];
  wordCount?: number;
  taskId?: string;
  taskTitle?: string;
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

  const loadReflections = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both dedicated reflections and task-based reflections
      const [reflectionResponse, tasksResponse] = await Promise.all([
        fetch('/api/reflection?limit=50'),
        fetch('/api/tasks')
      ]);

      let allReflections: Reflection[] = [];

      // Process dedicated reflections
      if (reflectionResponse.ok) {
        const reflectionData = await reflectionResponse.json();
        const reflectionsData = reflectionData.reflections || [];

        const dedicatedReflections = reflectionsData.map((reflection: any) => ({
          id: reflection.id,
          content: reflection.content,
          createdAt: reflection.createdAt,
          taskId: reflection.taskId, // Use the direct taskId field
          taskTitle: reflection.task?.title,
          tags: extractTags(reflection.content),
          wordCount: reflection.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length
        }));

        allReflections = [...allReflections, ...dedicatedReflections];
      }

      // Process task-based reflections
      if (tasksResponse.ok) {
        const taskData = await tasksResponse.json();
        const taskReflections = taskData.filter((task: any) => task.reflection).map((task: any) => ({
          id: `task-${task.id}`, // Create a unique ID for task reflections
          content: task.reflection,
          createdAt: task.completedAt || task.createdAt,
          taskId: task.id,
          taskTitle: task.title,
          tags: extractTags(task.reflection),
          wordCount: task.reflection.trim().split(/\s+/).filter((word: string) => word.length > 0).length
        }));

        allReflections = [...allReflections, ...taskReflections];
      }

      // Remove duplicates - the issue is that saveReflectionMutation saves to both places
      // We need to prioritize dedicated reflections and avoid showing the same reflection twice
      const reflectionMap = new Map();
      const taskIdsWithReflections = new Set();

      // Separate dedicated and task-based reflections
      const dedicatedReflections = allReflections.filter(r => !r.id.startsWith('task-'));
      const taskReflections = allReflections.filter(r => r.id.startsWith('task-'));

      // First pass: add all dedicated reflections (these are the "real" reflections)
      for (const reflection of dedicatedReflections) {
        if (reflection.taskId) {
          // This is a dedicated reflection linked to a task - always prioritize this
          taskIdsWithReflections.add(reflection.taskId);
          reflectionMap.set(`task_${reflection.taskId}`, reflection);
        } else {
          // This is a standalone dedicated reflection
          reflectionMap.set(`dedicated_${reflection.id}`, reflection);
        }
      }

      // Second pass: add task-based reflections ONLY if no dedicated reflection exists for that task
      // This prevents the duplicate issue where both task.reflection and Reflection record exist
      for (const reflection of taskReflections) {
        if (!taskIdsWithReflections.has(reflection.taskId)) {
          reflectionMap.set(`task_${reflection.taskId}`, reflection);
        }
      }

      // Convert back to array
      allReflections = Array.from(reflectionMap.values());



      // Sort by creation date, newest first
      allReflections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setReflections(allReflections);
      calculateStats(allReflections);
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  }, [loadReflections]);

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