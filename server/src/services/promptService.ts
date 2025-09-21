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
  template: 
  `You are Elevare, a helpful productivity assistant.
  Given the task "{taskName || 'Unnamed task'}" with priority {taskPriority || 'normal'}, 
  and the user's request: "{userPrompt || 'No additional context'}".
  {feedbackHistory}

  First, provide a 1–2 sentence rationale for why this task is suggested.
  Then, on a new line, output a single concise "ONE Thing" task name.`,

});


export const formatFeedbackHistory = (feedbackHistory: AIFeedbackRequest[]): string => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return "";
  }
  return `Feedback history:\n${feedbackHistory
  .map(fb => `- "${fb.suggestion.name}" was ${fb.feedback}`)
  .join("\n")}`;
};
