import { useState, useEffect } from "react";

export function useOneThingBot() {
  const [isBotVisible, setIsBotVisible] = useState(false);
  const [hasSeenBot, setHasSeenBot] = useState(false);

  useEffect(() => {
    // Check if user has seen the bot before
    const seen = localStorage.getItem('oneThingBot_seen');
    setHasSeenBot(!!seen);
  }, []);

  const toggleBot = () => {
    setIsBotVisible(!isBotVisible);
    
    // Mark as seen when first opened
    if (!hasSeenBot && !isBotVisible) {
      localStorage.setItem('oneThingBot_seen', 'true');
      setHasSeenBot(true);
    }
  };

  const showBot = () => {
    setIsBotVisible(true);
    if (!hasSeenBot) {
      localStorage.setItem('oneThingBot_seen', 'true');
      setHasSeenBot(true);
    }
  };

  const hideBot = () => {
    setIsBotVisible(false);
  };

  return {
    isBotVisible,
    hasSeenBot,
    toggleBot,
    showBot,
    hideBot
  };
}