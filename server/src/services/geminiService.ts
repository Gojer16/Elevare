import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { GoogleGenerativeAIChatInput } from '@langchain/google-genai';
import { RunnableSequence } from '@langchain/core/runnables';
import { SUGGESTION_PROMPT_TEMPLATE } from './promptService';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables.");
}

const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const model = new ChatGoogleGenerativeAI({
  apiKey,
  model: modelName,
} as GoogleGenerativeAIChatInput);

let suggestionChain: RunnableSequence | null = null;

export const getSuggestionChain = (): RunnableSequence<{ task: string }, string> => {
  if (!suggestionChain) {
    suggestionChain = RunnableSequence.from([
      SUGGESTION_PROMPT_TEMPLATE,
      model,
    ]);
  }
  return suggestionChain;
};

// streaming for real-time suggestions 
export const streamSuggestion = async (input: any) => {
  const stream = await model.stream(input);
  for await (const chunk of stream) {
    console.log(chunk.content);
  }
};