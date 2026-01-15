
import React, { useEffect, useState, useRef } from 'react';
import { AppState, ExerciseType } from '../types';
import { EXERCISE_LABELS, EXERCISE_ICONS, DRILLS, LEVEL_ROADMAP } from '../constants';
import { getAdaptiveAdvice, getWeeklyChallenge } from '../services/geminiService';

interface DashboardProps {
  state: AppState;
  onStartExercise: (type: ExerciseType) => void;
  onToggleDrill: (drillName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onStartExercise, onToggleDrill }) => {
  const [advice, setAdvice] = useState<string>('Analyzing your performance...');
  const [challenge, setChallenge] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Clock & Nap Timer State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [napTimeLeft, setNapTimeLeft] = useState<number | null>(null);
  const [isNapRinging, setIsNapRinging] = useState(false);
  const napIntervalRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const last3 = state.sessions.slice(-3).map(s => `${s.type}: ${s.sets.reduce((a,b) => a+b.reps, 0)}`).join(', ');
      const adv = await getAdaptiveAdvice(last3 || "New Warrior");
      setAdvice(adv);
      const chall = await getWeeklyChallenge(last3);
      setChallenge(chall);
      setLoading(false);
    };
    fetchData();

    // Clock update
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, [state.sessions]);

  const startNap = (minutes: number) => {
    if (napIntervalRef.current) clearInterval(napIntervalRef.current);
    setIsNapRinging(false);
    setNapTimeLeft(minutes * 60);
    
    napIntervalRef.current = setInterval(() => {
      setNapTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(napIntervalRef.current);
          setIsNapRinging(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelNap = () => {
    if (napIntervalRef.current) clearInterval(napIntervalRef.current);
    setNapTimeLeft(null);
    setIsNapRinging(false);
  };

  const formatNapTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysSchedule = state.profile.weeklySchedule[todayStr] || [];
  
  const getProgressForToday = (type: ExerciseType) => {
    const todayISO = new Date().toISOString().split('T')[0];
    const todaysSessions = state.sessions.filter(s => s.type === type && s.date === todayISO);
    return todaysSessions.reduce((acc, s) => acc + s.sets.reduce((a, b) => a + b.reps, 0), 0);
  };

  const nextUnlock = LEVEL_ROADMAP.find(item => item.level > state.profile.level);
  const currentLevel = state.profile.level;
  const isGodTier = currentLevel >= 30;

  return (
    <div className={`p-4 space-y-6 pb-24 transition-all duration-700 ${isGodTier ? 'bg-amber-950/10' : currentLevel >= 20 ? 'bg-indigo-950/20' : ''}`}>
      {/* HUD Header */}
      <div className="flex justify-between items-start pt-4 px-2">
        <div className="space-y-1">
          <h1 className={`text-2xl font-orbitron font-black italic tracking-tighter ${isGodTier ? 'text-amber-500' : 'text-white'}`}>TITAN FORGE</h1>
          <div className="flex items-center gap-3">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{state.profile.name}</p>
            <div className="h-3 w-px bg-slate-800"></div>
            <p className="text-blue-400 font-orbitron text-[10px] font-bold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`${isGodTier ? 'text-amber-400' : 'text-blue-400'} font-orbitron font-bold text-xl leading-none`}>LVL {currentLevel}</div>
          <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">{state.profile.xp} XP</div>
        </div>
      </div>

      {/* Hero Motivational Image */}
      <div className={`w-full aspect-video rounded-[2.5rem] overflow-hidden relative shadow-2xl border bg-slate-900 group ${isGodTier ? 'border-amber-500/40 shadow-amber-500/20' : 'border-blue-500/20'}`}>
        <img 
          src="https://i.ibb.co/XfKB9bjd/are-there-any-memorable-moments-or-quotes-from-the-mcu-that-v0-i9ui2paybroa1.jpg" 
          className="w-full h-full object-cover transition-transform duration-[20000ms] group-hover:scale-125 opacity-70 mix-blend-screen" 
          alt="MCU Avengers Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] mb-1 ${isGodTier ? 'text-amber-400' : 'text-cyan-400'}`}>Superhuman Potential</p>
          <h2 className="text-3xl font-orbitron font-black text-white uppercase leading-none tracking-tight drop-shadow-2xl">
            {isGodTier ? "GOD-TIER TITAN" : currentLevel >= 15 ? "DIVINE GROWTH" : "ULTIMATE GROWTH"}
          </h2>
        </div>
      </div>

      {/* Titan Chrono & Nap Timer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden group shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">Titan Chrono</h3>
            <p className="text-xl font-orbitron font-black text-white">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          {isNapRinging && (
             <button onClick={cancelNap} className="bg-red-500 animate-bounce px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
               WAKE UP!
             </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {napTimeLeft === null ? (
            <div className="flex-1 flex gap-2">
              {[10, 15, 20, 30].map(m => (
                <button 
                  key={m} 
                  onClick={() => startNap(m)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-400 transition-all active:scale-95"
                >
                  {m}m
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-black/40 px-5 py-3 rounded-2xl border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-orbitron font-black text-blue-400 text-lg">{formatNapTime(napTimeLeft)}</span>
              </div>
              <button onClick={cancelNap} className="text-[9px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Persistence Daily Motivation */}
      <div className="grid grid-cols-1 gap-4">
        <div className={`relative overflow-hidden rounded-3xl bg-slate-900 border p-6 ${isGodTier ? 'border-amber-500/30' : 'border-slate-800'}`}>
          {!state.dailyQuote ? (
             <div className="animate-pulse space-y-2">
               <div className="h-3 bg-slate-800 rounded w-3/4"></div>
               <div className="h-3 bg-slate-800 rounded w-1/2"></div>
             </div>
          ) : (
            <div className="relative z-10">
              <h3 className={`${isGodTier ? 'text-amber-500' : 'text-blue-500'} text-[9px] font-black uppercase tracking-[0.3em] mb-3`}>Titan Philosophy</h3>
              <p className="text-lg font-bold text-slate-100 italic leading-snug">"{state.dailyQuote.quote}"</p>
              <div className="flex justify-between items-end mt-4">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">— {state.dailyQuote.character} <span className="text-slate-700 mx-1">/</span> {state.dailyQuote.source}</p>
                <div className={`${isGodTier ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} px-2 py-1 rounded border text-[8px] font-black uppercase tracking-widest`}>Protocol Active</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Punishment Chamber Logic */}
      {currentLevel >= 8 && (
        <div className="bg-red-950/10 border border-red-500/30 p-6 rounded-[2rem] relative overflow-hidden group">
          <h3 className="text-red-500 text-[9px] font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            Punishment Matrix
          </h3>
          <p className="text-slate-300 text-xs font-medium leading-relaxed italic">
            "Missed drills result in -20XP decay on reset. Your discipline is your shield."
          </p>
        </div>
      )}

      {/* Next Unlock Progress */}
      {nextUnlock && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden group shadow-lg">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:bg-slate-700 transition-colors">
            {nextUnlock.icon}
          </div>
          <div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Next Unlock @ LVL {nextUnlock.level}</p>
            <h4 className="text-white font-bold text-sm mt-0.5">{nextUnlock.title}</h4>
            <p className="text-slate-400 text-[10px] mt-1 line-clamp-1">{nextUnlock.description}</p>
          </div>
        </div>
      )}

      {/* Operational Protocol */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Operational Protocol</h2>
        <div className="grid gap-4">
          {todaysSchedule.length === 0 ? (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl py-12 flex flex-col items-center justify-center grayscale">
              <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Rest Day Logged.</p>
            </div>
          ) : (
            todaysSchedule.map((type) => {
              const prog = getProgressForToday(type);
              const goal = state.profile.dailyGoals[type] || 0;
              const unit = type === 'cardio' ? 'Km' : 'Reps';
              const progressPercent = Math.min((prog/goal)*100, 100);
              return (
                <button 
                  key={type}
                  onClick={() => onStartExercise(type)}
                  className={`bg-slate-900 border p-5 rounded-[2rem] flex items-center gap-5 text-left active:scale-[0.98] transition-all group ${isGodTier ? 'border-amber-500/20 hover:border-amber-500/50' : 'border-slate-800 hover:border-blue-500/50'}`}
                >
                  <div className={`p-4 rounded-2xl group-hover:text-white transition-colors shadow-inner ${isGodTier ? 'bg-amber-950 text-amber-400 group-hover:bg-amber-500' : 'bg-slate-800 text-blue-400 group-hover:bg-blue-500'}`}>
                    {EXERCISE_ICONS[type] || EXERCISE_ICONS['push_ups']}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-slate-100 uppercase tracking-tight text-sm">{EXERCISE_LABELS[type] || type}</span>
                      <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded-full ${isGodTier ? 'text-amber-400 bg-amber-400/10' : 'text-blue-500 bg-blue-500/10'}`}>{prog} / {goal} {unit}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                      <div className={`h-full transition-all duration-1000 ${isGodTier ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Preparation Drills Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Prep Drills</h2>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isGodTier ? 'text-amber-400 bg-amber-400/10' : 'text-blue-500 bg-blue-500/10'}`}>{state.completedDrills.length} / {DRILLS.length}</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {DRILLS.map((d, i) => {
            const isDone = state.completedDrills.includes(d.name);
            return (
              <button 
                key={i} 
                onClick={() => onToggleDrill(d.name)}
                className={`flex-shrink-0 w-44 p-5 rounded-[2rem] border transition-all duration-300 text-left relative overflow-hidden group ${isDone ? 'bg-emerald-900/20 border-emerald-500/50' : isGodTier ? 'bg-amber-950/20 border-amber-900/20 hover:border-amber-500/50' : 'bg-slate-900 border-slate-800 hover:border-blue-500/50'}`}
              >
                {isDone && <div className="absolute top-0 right-0 p-2"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>}
                <p className={`font-black text-xs uppercase tracking-tight mb-1 ${isDone ? 'text-emerald-400' : isGodTier ? 'text-amber-500' : 'text-blue-400'}`}>{d.name}</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{d.focus}</p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  <p className="font-orbitron text-[10px] text-slate-100">{d.duration}</p>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${isDone ? 'bg-emerald-500 text-white' : isGodTier ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-blue-500 group-hover:text-white'}`}>
                    {isDone ? 'OK' : 'GO'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
