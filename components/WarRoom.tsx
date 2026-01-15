
import React, { useState, useEffect } from 'react';
import { StudySession } from '../types';

interface WarRoomProps {
  onLogSession: (session: Partial<StudySession>) => void;
  level: number;
}

export const WarRoom: React.FC<WarRoomProps> = ({ onLogSession, level }) => {
  const [mode, setMode] = useState<'pomodoro' | 'mcq' | 'warmup'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mcqTarget, setMcqTarget] = useState(60);
  const [mcqCount, setMcqCount] = useState(0);
  const [cheatSheetCount, setCheatSheetCount] = useState(1);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleFinish = () => {
    if (mode === 'pomodoro') {
      onLogSession({ type: 'pomodoro', durationMinutes: 25 });
    } else if (mode === 'mcq') {
      onLogSession({ type: 'mcq', durationMinutes: 1, count: mcqCount });
    } else {
      onLogSession({ type: 'revision', durationMinutes: 10 });
    }
    alert("War Session Complete!");
  };

  const startPomodoro = () => {
    setMode('pomodoro');
    setTimeLeft(25 * 60);
    setIsActive(true);
  };

  const startMCQ = () => {
    setMode('mcq');
    setTimeLeft(mcqTarget);
    setIsActive(true);
  };

  const startWarmup = () => {
    setMode('warmup');
    setTimeLeft(10 * 60);
    setIsActive(true);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const isSuper = level >= 10;

  return (
    <div className="p-4 space-y-6">
      <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-indigo-500/20 bg-slate-900 group">
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200&h=675" 
          className="w-full h-full object-cover opacity-50 transition-transform duration-[10000ms] group-hover:scale-125" 
          alt="Focused Meditation"
        />
        
        {/* The War Art: Animated Yin-Yang Neural Core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl animate-pulse scale-150"></div>
            <svg className="w-48 h-48 animate-[spin_45s_linear_infinite] drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" viewBox="0 0 100 100">
              <path d="M50 0 A50 50 0 0 1 50 100 A25 25 0 0 1 50 50 A25 25 0 0 0 50 0" fill="#a855f7" className="animate-pulse" />
              <path d="M50 100 A50 50 0 0 1 50 0 A25 25 0 0 1 50 50 A25 25 0 0 0 50 100" fill="#312e81" />
              <circle cx="50" cy="25" r="4" fill="#312e81" />
              <circle cx="50" cy="75" r="4" fill="#a855f7" />
              {/* Extra Neural Lines for high level */}
              {isSuper && (
                <g stroke="white" strokeWidth="0.5" opacity="0.3" fill="none">
                  <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="40" strokeDasharray="1 3" />
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-6 left-8">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] mb-1">Domain: Neural Expansion</p>
          <h2 className="text-xl font-orbitron font-black text-white uppercase leading-none italic tracking-tighter">COGNITIVE SUPREMACY</h2>
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden transition-all duration-500 ${isSuper ? 'bg-gradient-to-br from-indigo-900 to-black border-purple-500/50' : 'bg-gradient-to-br from-indigo-900 to-purple-950 border-purple-500/30'}`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
        <h2 className="text-2xl font-orbitron font-black text-white mb-2 tracking-tighter uppercase italic">The War Room</h2>
        <p className="text-purple-300 text-[9px] font-black uppercase tracking-[0.4em]">Neural Grind Engine</p>

        <div className="mt-8 flex flex-col items-center">
          <div className="text-7xl font-orbitron font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{formatTime(timeLeft)}</div>
          
          <div className="flex flex-col gap-4 w-full">
            {!isActive ? (
              <>
                <div className="flex gap-4">
                  <button onClick={startPomodoro} className="flex-1 py-5 bg-purple-600 rounded-[1.5rem] font-black text-xs transition-all hover:bg-purple-500 active:scale-95 shadow-lg shadow-purple-900/40 uppercase tracking-widest">Pomodoro</button>
                  <button onClick={startMCQ} className="flex-1 py-5 bg-red-600 rounded-[1.5rem] font-black text-xs transition-all hover:bg-red-500 active:scale-95 shadow-lg shadow-red-900/40 uppercase tracking-widest">MCQ Blitz</button>
                </div>
                {level >= 12 && (
                  <button onClick={startWarmup} className="w-full py-5 bg-indigo-600/20 border border-indigo-500/30 rounded-[1.5rem] font-black text-[10px] text-indigo-400 uppercase tracking-[0.3em] transition-all hover:bg-indigo-600/40 active:scale-95">
                    Execute Cognitive Prime (10m)
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => setIsActive(false)} className="w-full py-5 bg-slate-800 rounded-[1.5rem] font-black uppercase tracking-widest transition-all hover:bg-slate-700 active:scale-95 border border-slate-700">Abort Mission</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col justify-between hover:border-purple-500/50 transition-all group">
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Intelligence</p>
            <p className="text-white font-black text-sm mb-3 uppercase tracking-tighter">Cheat Sheets</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={cheatSheetCount}
              onChange={e => setCheatSheetCount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-12 bg-black/40 border border-slate-800 rounded-xl text-center text-xs font-bold text-purple-400 focus:border-purple-500 outline-none"
            />
            <button 
              onClick={() => {
                onLogSession({ type: 'cheatsheet', durationMinutes: 60, count: cheatSheetCount });
                alert(`Logged ${cheatSheetCount} Cheat Sheets!`);
              }} 
              className="flex-1 py-3 bg-purple-600/80 hover:bg-purple-600 rounded-xl text-[9px] font-black uppercase transition-all active:scale-95"
            >
              Log {cheatSheetCount > 1 ? 'All' : 'One'}
            </button>
          </div>
        </div>

        <button onClick={() => { onLogSession({ type: 'revision', durationMinutes: 120 }); alert('2H Revision Logged!'); }} className="p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] text-left hover:border-purple-500/50 transition-all flex flex-col justify-between group">
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">Infiltration</p>
            <p className="text-white font-black text-sm uppercase tracking-tighter">Mass Revision</p>
          </div>
          <p className="text-[8px] text-purple-400 font-black uppercase tracking-[0.2em] mt-4 opacity-60 group-hover:opacity-100">2H XP Multiplier</p>
        </button>
      </div>
    </div>
  );
};
