import { AchievementCategory } from "@prisma/client";

export const achievements = [
  // --- Task based ---
  {
    code: "first_task",
    title: "First Step",
    description: "Complete your first task.",
    icon: "🥇",
    category: AchievementCategory.TASK,
  },
  {
    code: "tasks_10",
    title: "Getting Things Done",
    description: "Complete 10 tasks.",
    icon: "✅",
    category: AchievementCategory.TASK,
  },
  {
    code: "tasks_100",
    title: "Task Master",
    description: "Complete 100 tasks.",
    icon: "🏆",
    category: AchievementCategory.TASK,
  },

  // --- Streak based ---
  {
    code: "streak_3",
    title: "Consistency Builder",
    description: "Maintain a 3-day streak.",
    icon: "📅",
    category: AchievementCategory.STREAK,
  },
  {
    code: "streak_7",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak.",
    icon: "🔥",
    category: AchievementCategory.STREAK,
  },
  {
    code: "streak_30",
    title: "Monthly Machine",
    description: "Maintain a 30-day streak.",
    icon: "⚡",
    category: AchievementCategory.STREAK,
  },

  // --- Reflection based ---
  {
    code: "first_reflection",
    title: "Deep Thinker",
    description: "Write your first reflection.",
    icon: "📝",
    category: AchievementCategory.REFLECTION,
  },
  {
    code: "reflections_10",
    title: "Reflective Mind",
    description: "Write 10 reflections.",
    icon: "💭",
    category: AchievementCategory.REFLECTION,
  },
  {
    code: "reflections_100",
    title: "Wise Sage",
    description: "Write 100 reflections.",
    icon: "📚",
    category: AchievementCategory.REFLECTION,
  },

  // --- Fun/Meta ---
  {
    code: "night_owl",
    title: "Night Owl",
    description: "Complete a task after midnight.",
    icon: "🌙",
    category: AchievementCategory.OTHER,
  },
  {
    code: "early_bird",
    title: "Early Bird",
    description: "Complete a task before 7 AM.",
    icon: "☀️",
    category: AchievementCategory.OTHER,
  },
];
