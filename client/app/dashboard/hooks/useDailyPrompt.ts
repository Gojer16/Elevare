import { useState, useEffect } from "react";
import { dailyPrompts } from "../../data/dailyPrompts";

export function useDailyPrompt() {
  const [prompt, setPrompt] = useState<string | null>(null);

  useEffect(() => {
    const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    setPrompt(randomPrompt);
  }, []);

  return { prompt };
}
