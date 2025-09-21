import { PromptTemplate } from "@langchain/core/prompts";
import { AIFeedbackRequest } from "../types/api";

type SuggestionPromptInput = {
  taskName: string;
  taskPriority: string;
  userPrompt: string;
  feedbackHistory: string;
};


export const SUGGESTION_PROMPT_TEMPLATE = new PromptTemplate<SuggestionPromptInput>({
  inputVariables: ["taskName", "taskPriority", "userPrompt", "feedbackHistory"],
  template: `You are Elevare, a helpful productivity assistant.
  Given the task "{taskName}" with priority {taskPriority}, 
  and the user's request: "{userPrompt}".
  {feedbackHistory}

  First, provide a 1–2 sentence rationale for why this task is suggested.
  Then, on a new line, output a single concise "ONE Thing" task name.`,
});


export const formatFeedbackHistory = (
  feedbackHistory: AIFeedbackRequest[],
  limit = 5
): string => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return "";
  }

  const recent = feedbackHistory.slice(-limit);
  return `Feedback history:\n${recent
    .map(fb => `- "${fb.suggestion.name}" was ${fb.feedback}`)
    .join("\n")}`;
};

export function buildSuggestionPromptInput(taskName: string, priority: number, prompt: string, history: any[]) {
  return {
    taskName: taskName?.trim() || "Unnamed task",
    taskPriority: String(priority ?? "normal"),
    userPrompt: prompt?.trim() || "No additional context",
    feedbackHistory: formatFeedbackHistory(history),
  };
}

// Replace the previous alias with a 3-arg-friendly wrapper
export function generateSuggestionPrompt(
  task: string | { name?: string; priority?: number },
  userPrompt: string,
  history: any[] = []
) {
  const taskName = typeof task === "string" ? task : task?.name ?? "Task";
  const priority = typeof task === "string" ? 1 : (typeof task.priority === "number" ? task.priority : 1);
  return buildSuggestionPromptInput(taskName, priority, userPrompt, history);
}