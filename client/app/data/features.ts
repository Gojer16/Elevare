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
  icon: React.ElementType;
  image: string;
}

export const features: Feature[] = [
  {
    title: "Focus on Your ONE Thing",
    description:
      "Inspired by the book The ONE Thing, Elevare helps you identify and commit to the single most important task that makes everything else easier or unnecessary. This laser-focus approach prevents you from feeling overwhelmed by endless to-do lists and ensures you're always working on what truly matters, creating a domino effect of success.",
    icon: Target,
    image: "",
  },
  {
    title: "Simple Daily Planning",
    description:
      "Forget complicated planning tools. With Elevare, you get a clean, minimalist space to define your ONE Thing for the day. You can add a few supporting tasks if needed, but the emphasis is always on clarity and commitment. This intentional planning process takes only a few minutes but sets the trajectory for a highly effective day.",
    icon: CalendarCheck,
    image: "",
  },
  {
    title: "Track Progress with Purpose",
    description:
      "It's not about being busy; it's about being productive. Elevare provides a clear visual representation of your progress, showing your completed ONE Things over time. This focus on momentum helps you see how small, consistent efforts compound into significant achievements, keeping you motivated and focused on the bigger picture.",
    icon: LineChart,
    image: "",
  },
  {
    title: "Build Lasting Habits",
    description:
      "True success comes from what you do consistently. By focusing on a single, important task each day, Elevare helps you build the powerful habit of prioritization and execution. This isn't just about getting things done; it's about wiring your brain for success and turning daily actions into long-term personal and professional growth.",
    icon: Sparkles,
    image: "",
  },
  {
    title: "Reflect & Learn Fast",
    description:
      "At the end of each day, Elevare prompts you with a simple reflection. This powerful habit helps you acknowledge your wins, understand what went wrong, and identify what you can do better tomorrow. It’s a cycle of continuous improvement that ensures you’re not just working hard, but also working smarter over time.",
    icon: Clock,
    image: "",
  },
  {
    title: "Celebrate Small Wins",
    description:
      "The journey to extraordinary results is a marathon, not a sprint. Elevare encourages you to acknowledge and celebrate each completed ONE Thing. This practice of recognizing small wins provides a steady stream of motivation, builds confidence, and makes the process of achieving your goals enjoyable and sustainable.",
    icon: CheckCircle2,
    image: "",
  },
];