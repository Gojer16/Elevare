"use client";
import { useEffect } from "react";

interface CelebrationSoundsProps {
  isPlaying: boolean;
  volume?: number;
}

export function CelebrationSounds({ isPlaying, volume = 0.3 }: CelebrationSoundsProps) {
  useEffect(() => {
    if (!isPlaying) return;

    // Create celebration sound sequence
    const playSound = (frequency: number, duration: number, delay: number = 0) => {
      setTimeout(() => {
  type AudioContextConstructor = new (options?: AudioContextOptions) => AudioContext;
  type WindowWithWebkit = Window & { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor };
  const AudioCtor: AudioContextConstructor | undefined = (window as WindowWithWebkit).AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
  const audioContext = new (AudioCtor ?? (AudioContext as unknown as AudioContextConstructor))();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };

    // Success melody
    const melody = [
      { freq: 523.25, duration: 0.2, delay: 0 },     // C5
      { freq: 659.25, duration: 0.2, delay: 200 },   // E5
      { freq: 783.99, duration: 0.2, delay: 400 },   // G5
      { freq: 1046.50, duration: 0.4, delay: 600 },  // C6
      { freq: 783.99, duration: 0.2, delay: 1000 },  // G5
      { freq: 1046.50, duration: 0.6, delay: 1200 }, // C6
    ];

    melody.forEach(note => {
      playSound(note.freq, note.duration, note.delay);
    });

  }, [isPlaying, volume]);

  return null; // This component doesn't render anything
}