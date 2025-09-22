AI Assistant Features
Two-Mode Operation
Task Suggestion Mode: When you have existing tasks, Elevare analyzes them and suggests the ONE most important task for today.

Exploration Mode: When you need guidance without existing tasks, Elevare acts as a productivity coach to help you discover your ONE Thing.

Mode selection is automatic: if currentTasks are provided, Elevare runs Task Suggestion Mode. If not, it enters Exploration Mode.

Psychological Elements
Inner Clarity Framing: Reflective questions that tap into your motivation and identity, not just tasks. This helps you connect with your deeper purpose before taking action.
Progressive Narrowing: Ranked suggestions that funnel you toward the most impactful action. This prevents overwhelm and forces you to focus on high-leverage activities.
Emotion-Action Links: Connect tasks to confidence, progress, and self-identity outcomes. This makes action sticky and habit-forming by linking behavior to identity.
Extreme 80/20 Principle: Focus on the 0.8% of tasks that create 80% of results.

Base URL
elevare-ai-assistant.onrender.com/api/ai
Endpoints
POST /suggest
Get AI-powered suggestions for your ONE Thing.

Request Body:

{
  "prompt": "I want to learn Python",
  "currentTasks": [
    {
      "id": "1",
      "name": "learning python"
    },
    {
      "id": "2", 
      "name": "exercise"
    },
    {
      "id": "3",
      "name": "reading fiction"
    }
  ]
}
Response Examples:

Task Suggestion Mode:

{
    "success": true,
    "mode": "task-suggestion",
    "suggestion": {
        "name": "Master Python fundamentals through building a tiny project",
        "rationale": "Learning Python will give you the foundation to tackle any programming challenge. Building something real will make the concepts stick and give you immediate confidence in your abilities."
    }
}
Exploration Mode:

{
  "success": true,
  "mode": "exploration",
  "exploration": {
    "type": "brainstorm",
    "content": "Here are some HIGH-LEVERAGE actions you could take for your ONE Thing today:",
    "suggestions": [
      "Build a tiny Python project that solves a real problem you have (start with 30 minutes)",
      "Master the ONE Python concept that unlocks 80% of what you want to build",
      "Fix the ONE critical bug that's been blocking your progress",
      "Create a simple script that automates something you do manually every day"
    ],
    "reflection_question": "What would make learning Python feel most meaningful to you right now — building something that solves a real problem, mastering the fundamentals, or tackling challenging problems?",
    "progressive_path": "Start with the tiny project to build confidence and momentum, then layer in the concept mastery and problem-solving as you gain experience.",
    "identity_impact": "Completing a tiny Python project this week will immediately give you confidence and proof that you're becoming a Python builder who can solve real problems."
  }
}


elevare-ai-assistant.onrender.com