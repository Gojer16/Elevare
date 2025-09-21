import fs from "fs/promises";
import path from "path";
import { AIFeedbackRequest } from "../types/api";

const FEEDBACK_FILE = path.resolve(__dirname, "../data/feedback.json");

export const storeFeedback = async (feedback: AIFeedbackRequest): Promise<void> => {
  let feedbackHistory: AIFeedbackRequest[] = [];
  try {
    const data = await fs.readFile(FEEDBACK_FILE, "utf-8");
    feedbackHistory = JSON.parse(data);
    if (!Array.isArray(feedbackHistory)) {
      feedbackHistory = [];
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") throw error;
  }

  feedbackHistory.push(feedback);
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackHistory, null, 2));
};

export const getFeedbackHistory = async (): Promise<AIFeedbackRequest[]> => {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export const clearFeedback = async (): Promise<void> => {
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2));
};
