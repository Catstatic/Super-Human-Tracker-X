
import React, { useState, useEffect } from 'react';

interface RestTimerProps {
  duration: number; // seconds
  onComplete: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, onComplete]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-2xl shadow-xl border border-blue-500/30">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
            className="text-blue-500 transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-4xl font-orbitron font-bold">{timeLeft}s</span>
      </div>
      <p className="mt-4 text-blue-400 font-medium uppercase tracking-widest text-sm">Resting...</p>
      <button 
        onClick={onComplete}
        className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm font-semibold transition-colors"
      >
        Skip Rest
      </button>
    </div>
  );
};
