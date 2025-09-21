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

export const getSuggestionChain = (): RunnableSequence<any, string> => {
  if (!suggestionChain) {
    suggestionChain = RunnableSequence.from([
      SUGGESTION_PROMPT_TEMPLATE,
      model,
    ]);
  }
  return suggestionChain as RunnableSequence<any, string>;
};

export const streamSuggestion = async (input: any) => {
  const stream = await model.stream(input);
  for await (const chunk of stream) {
    console.log(chunk.content);
  }
};

// Add a small convenience wrapper used by tests
export async function generateGeminiContent(prompt: string | object): Promise<string> {
  // keep types loose because chain response shapes vary
  const chain = getSuggestionChain();
  const result: any = await chain.invoke(prompt as any);
  if (typeof result === "string") return result;
  // try common shapes first
  if (result?.content) return result.content?.[0]?.text ?? String(result);
  if (result?.text) return result.text;
  return String(result);
}