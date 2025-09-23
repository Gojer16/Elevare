import {
  Target,
  CalendarCheck,
  LineChart,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  promise: string;
  before: string;
  after: string;
  icon: React.ElementType;
  image?: string;
  tier: "Free" | "Pro";
}

export const features: Feature[] = [
  {
    title: "Focus on Your ONE Thing",
    description:
      "Inspired by the book The ONE Thing, Elevare helps you identify and commit to the single most important task that makes everything else easier or unnecessary. This laser-focus prevents overwhelm and creates a domino effect of success.",
    promise: "End decision fatigue. Focus made simple.",
    before: "Juggling endless to-dos, never knowing what matters most.",
    after: "One daily priority you can actually celebrate.",
    icon: Target,
    tier: "Free",
  },
  {
    title: "Simple Daily Planning",
    description:
      "Forget complicated tools. With Elevare, you define your ONE Thing in a clean, minimalist space. A few supporting tasks if needed, but the emphasis is clarity and commitment.",
    promise: "Plan in minutes, win the whole day.",
    before: "Spending more time planning than doing.",
    after: "A simple ritual that sets a clear direction every morning.",
    icon: CalendarCheck,
    tier: "Free",
  },
  {
    title: "Track Progress with Purpose",
    description:
      "Elevare gives you a clear visual history of your completed ONE Things. Small, consistent actions compound into big results, keeping you motivated.",
    promise: "See momentum build, not just tasks checked.",
    before: "Feeling stuck despite working hard every day.",
    after: "A visible streak of meaningful progress you can be proud of.",
    icon: LineChart,
    tier: "Free",
  },
  {
    title: "Build Lasting Habits",
    description:
      "Focusing on one key task each day rewires your brain for success. Over time, this creates a powerful habit of prioritization and execution.",
    promise: "Consistency becomes your superpower.",
    before: "Starting strong, but burning out fast.",
    after: "Daily focus turns into a lasting success habit.",
    icon: Sparkles,
    tier: "Free",
  },
  {
    title: "Reflect & Learn Fast",
    description:
      "At the end of each day, Elevare prompts you to reflect. This habit ensures you’re not just working hard, but working smarter over time.",
    promise: "Clarity in minutes, growth for life.",
    before: "Repeating mistakes without noticing patterns.",
    after: "Quick reflections that turn experience into insight.",
    icon: Clock,
    tier: "Free",
  },
  {
    title: "Celebrate Small Wins",
    description:
      "Every completed ONE Thing is progress. Elevare encourages you to pause, recognize it, and build confidence for tomorrow.",
    promise: "Progress feels good again.",
    before: "Always chasing the next task, never satisfied.",
    after: "Daily wins that fuel motivation and joy.",
    icon: CheckCircle2,
    tier: "Free",
  },

  // Example Premium Features
  {
    title: "Unlimited AI Guidance",
    description:
      "Go beyond daily limits with AI-powered task prioritization and insights whenever you need them.",
    promise: "AI that scales with your ambition.",
    before: "Hitting a cap when you need clarity most.",
    after: "Unlimited guidance to keep you moving forward.",
    icon: Target,
    tier: "Pro",
  },
  {
    title: "Advanced Analytics",
    description:
      "Discover trends, streaks, and focus patterns to improve your productivity over time.",
    promise: "Clarity backed by data.",
    before: "Working blindly without feedback.",
    after: "Insightful analytics that reveal your growth patterns.",
    icon: LineChart,
    tier: "Pro",
  },
  {
    title: "Reminders & Integrations",
    description:
      "Sync with your calendar and favorite tools, and get timely nudges to stay on track.",
    promise: "Stay aligned, wherever you work.",
    before: "Forgetting important focus sessions.",
    after: "Timely reminders and smooth integrations that keep you consistent.",
    icon: CalendarCheck,
    tier: "Pro",
  },
];
