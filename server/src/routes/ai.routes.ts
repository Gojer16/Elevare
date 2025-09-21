import * as express from "express";
import { Request, Response } from "express";
import { buildSuggestionPromptInput, SUGGESTION_PROMPT_TEMPLATE } from "../services/promptService";
import { getSuggestionChain } from "../services/geminiService";
import { selectTask } from "../services/heuristicService";
import { getFeedbackHistory, storeFeedback } from "../services/feedbackService";

const router = express.Router();

// AI-202: AI suggestion (ONE Thing card)
router.post("/suggest", async (req: Request, res: Response) => {
  const { prompt, currentTasks } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (currentTasks && !Array.isArray(currentTasks)) {
    return res.status(400).json({ error: "currentTasks must be an array." });
  }

  try {
    const selectedTask = selectTask(currentTasks || []);
    if (!selectedTask) {
      return res.status(400).json({ error: "No tasks to suggest." });
    }

    // Get feedback history
    const feedbackHistory = await getFeedbackHistory();

    // Build AI input
    const input = buildSuggestionPromptInput(
      selectedTask.name,
      selectedTask.priority,
      prompt,
      feedbackHistory
    );

    // Run Gemini chain
    const chain = getSuggestionChain();
    const aiResponse = await chain.invoke(input);

    // --- Parse AI response ---
    let rationale = "";
    let name = selectedTask.name;

    if (typeof aiResponse === "string") {
      const parts = aiResponse.trim().split("\n").filter(Boolean);
      rationale = parts[0] || "This is your highest priority task.";
      name = parts[1] || selectedTask.name;
    } else if ((aiResponse as any).content) {
      // keep a minimal any here because the chain response shape varies
      rationale = (aiResponse as any).content?.[0]?.text || "This is your highest priority task.";
    }

    const suggestedTask = { name, rationale };
    return res.json({ success: true, suggestion: suggestedTask });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/ai/suggest:", message);
    return res.status(500).json({ error: "Failed to generate suggestion." });
  }
});

// AI-203: Submit feedback on AI suggestion
router.post("/feedback", async (req: Request, res: Response) => {
  const { suggestion, feedback } = req.body;

  if (!suggestion || !feedback) {
    return res.status(400).json({ error: "Suggestion and feedback are required." });
  }

  try {
    await storeFeedback({ suggestion, feedback });
    res.json({ success: true, message: "Feedback received." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error storing feedback:", message);
    res.status(500).json({ error: "Failed to store feedback." });
  }
});

export default router;
