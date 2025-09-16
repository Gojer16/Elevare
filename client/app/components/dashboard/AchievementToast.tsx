'use client';

import { useEffect, useState } from 'react';

interface AchievementToastProps {
  achievement: {
    title: string;
  };
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      🎉 Achievement Unlocked: {achievement.title}
    </div>
  );
}
