import React, { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const MESSAGES = [
  'Analyzing itinerary details...',
  'Calculating transit times...',
  'Fetching airport terminal data...',
  'Checking weather forecasts...',
  'Finalizing your journey map...',
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev >= MESSAGES.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-20 bg-[#fcf8fb] dark:bg-[#1b1b1d]">
      {/* Processing Visual Container */}
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        {/* Subtle background ring */}
        <svg className="absolute inset-0 w-full h-full text-[#e4e2e4] dark:text-[#3a3a3e]" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>

        {/* Animated progress ring */}
        <svg className="absolute inset-0 w-full h-full spinner" viewBox="0 0 50 50">
          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
        </svg>

        {/* Center Icon */}
        <span className="material-symbols-outlined text-[#0058bc] dark:text-[#adc6ff] text-2xl">
          sync
        </span>
      </div>

      {/* Sequential Status Message */}
      <div className="text-center h-12 relative overflow-hidden w-full max-w-sm">
        <p key={msgIndex} className="text-lg font-semibold text-[#1b1b1d] dark:text-[#f3f0f2] fade-text">
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Subtle Progress Dots */}
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-[#0058bc] dark:bg-[#adc6ff] animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-[#0058bc] dark:bg-[#adc6ff] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-[#0058bc] dark:bg-[#adc6ff] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </main>
  );
};
