import { useState, useEffect } from "react";
import { quotes } from "../../data/quotes";

interface Quote {
  text: string;
  author: string;
}

export function useQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const refreshQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  return { quote, refreshQuote };
}