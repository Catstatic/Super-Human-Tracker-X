
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { FLUTE_TECHNIQUES } from '../constants';
import { getFluteMasteryEstimate } from '../services/geminiService';

interface CreativeHubProps {
  state: AppState;
  onLogFlute: (technique: string, mins: number) => void;
  onLogNovelMins: (mins: number) => void;
  onLogNovelPages: (pages: number) => void;
  onUpdateProfile: (newProfile: AppState['profile']) => void;
}

const AUTHOR_QUOTES = [
  { quote: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
  { quote: "You can always edit a bad page. You can’t edit a blank page.", author: "Jodi Picoult" },
  { quote: "A professional writer is an amateur who didn’t quit.", author: "Richard Bach" },
  { quote: "Write while the heat is in you. The writer who postpones the recording of his thoughts uses an iron which has cooled to burn a hole with.", author: "Henry David Thoreau" },
  { quote: "If there's a book that you want to read, but it hasn't been written yet, then you must write it.", author: "Toni Morrison" },
  { quote: "The road to hell is paved with adverbs.", author: "Stephen King" }
];

export const CreativeHub: React.FC<CreativeHubProps> = ({ state, onLogFlute, onLogNovelMins, onLogNovelPages, onUpdateProfile }) => {
  const [mins, setMins] = useState(30);
  const [tech, setTech] = useState(FLUTE_TECHNIQUES[0]);
  const [estimate, setEstimate] = useState('');
  const [isEstLoading, setIsEstLoading] = useState(false);
  const [newTechInput, setNewTechInput] = useState('');
  
  // Novel state
  const [isEditingMinsGoal, setIsEditingMinsGoal] = useState(false);
  const [isEditingPagesGoal, setIsEditingPagesGoal] = useState(false);
  const [tempMinsGoal, setTempMinsGoal] = useState(state.profile.novelMinsGoal / 60);
  const [tempPagesGoal, setTempPagesGoal] = useState(state.profile.novelPagesGoal);
  const [pagesInput, setPagesInput] = useState<number>(0);
  
  // Timer state
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialMins, setInitialMins] = useState(0);

  const allTechniques = [...FLUTE_TECHNIQUES, ...state.profile.customFluteTechniques];

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      onLogFlute(tech, initialMins);
      alert(`${tech} Session Complete!`);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, tech, initialMins, onLogFlute]);

  const handleStartTimer = () => {
    if (mins <= 0) return;
    setInitialMins(mins);
    setTimeLeft(mins * 60);
    setIsTimerActive(true);
  };

  const handleAddTechnique = () => {
    if (!newTechInput.trim()) return;
    if (allTechniques.includes(newTechInput.trim())) return;
    
    const updatedCustom = [...state.profile.customFluteTechniques, newTechInput.trim()];
    onUpdateProfile({
      ...state.profile,
      customFluteTechniques: updatedCustom
    });
    setNewTechInput('');
  };

  const handleUpdateMinsGoal = () => {
    onUpdateProfile({ ...state.profile, novelMinsGoal: tempMinsGoal * 60 });
    setIsEditingMinsGoal(false);
  };

  const handleUpdatePagesGoal = () => {
    onUpdateProfile({ ...state.profile, novelPagesGoal: tempPagesGoal });
    setIsEditingPagesGoal(false);
  };

  const handleLogPages = () => {
    if (pagesInput <= 0) return;
    onLogNovelPages(pagesInput);
    setPagesInput(0);
  };

  const handleEst = async () => {
    setIsEstLoading(true);
    setEstimate("Consulting the Flute Master...");
    try {
      const res = await getFluteMasteryEstimate(tech, mins);
      setEstimate(res);
    } catch {
      setEstimate("Mastery estimate failed. Stay consistent, Warrior.");
    } finally {
      setIsEstLoading(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const minsPercent = Math.min((state.novelMins / state.profile.novelMinsGoal) * 100, 100);
  const pagesPercent = Math.min((state.novelPages / state.profile.novelPagesGoal) * 100, 100);
  const currentQuote = AUTHOR_QUOTES[Math.floor(Date.now() / 86400000) % AUTHOR_QUOTES.length];

  return (
    <div className="p-4 space-y-8 pb-32">
      {/* Creative Hub Hero Image */}
      <div className="w-full aspect-video rounded-[3rem] overflow-hidden relative shadow-2xl border border-amber-500/20 bg-slate-900 group">
        <img 
          src="https://i.ibb.co/WWq0kKtN/flute-of-lord-krishna.jpg" 
          className="w-full h-full object-cover opacity-80 mix-blend-screen transition-transform duration-[15000ms] group-hover:scale-110" 
          alt="Handsomely Cinematic Flute Master"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-10">
          <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.8em] mb-2 drop-shadow-md">Harmonic Intelligence</p>
          <h2 className="text-3xl font-orbitron font-black text-white uppercase leading-none tracking-tighter">SONIC SAGE</h2>
        </div>
      </div>

      {/* Bansuri Forge Card */}
      <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 p-8 rounded-[2.5rem] border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-orbitron font-black text-white mb-2 tracking-tighter uppercase italic">Bansuri Forge</h2>
        <div className="mt-6 space-y-6">
          {isTimerActive ? (
            <div className="flex flex-col items-center py-10 bg-black/40 rounded-[2rem] border border-amber-500/20 backdrop-blur-md">
              <div className="text-7xl font-orbitron font-black text-white tracking-tighter">{formatTime(timeLeft)}</div>
              <button 
                onClick={() => setIsTimerActive(false)} 
                className="mt-8 px-10 py-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/40 text-[10px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 shadow-lg"
              >
                Abort
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              <select 
                value={tech} 
                onChange={e => setTech(e.target.value)}
                className="w-full bg-slate-950/80 border border-amber-900/30 rounded-2xl px-5 py-4 text-sm text-amber-100 outline-none shadow-inner focus:border-amber-500 transition-colors"
              >
                {allTechniques.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <input 
                    type="number" 
                    value={mins} 
                    onChange={e => setMins(parseInt(e.target.value) || 0)} 
                    className="w-full bg-black/40 border border-amber-900/30 rounded-2xl px-4 py-4 text-white font-orbitron text-center outline-none focus:border-amber-500" 
                  />
                </div>
                <button 
                  onClick={handleStartTimer} 
                  className="flex-[2] bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest active:scale-[0.98] transition-all shadow-xl shadow-amber-900/20"
                >
                  Start session
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={handleEst} 
            disabled={isEstLoading}
            className="w-full text-[9px] text-amber-500/60 hover:text-amber-400 font-black uppercase tracking-[0.4em] py-4 border border-amber-900/20 rounded-2xl transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isEstLoading ? 'Processing Calculus...' : 'Request Mastery Calculus'}
          </button>
          {estimate && (
            <div className="mt-4 text-[11px] italic text-amber-200/80 bg-black/30 p-5 rounded-2xl border border-amber-900/10 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2">
              "{estimate}"
            </div>
          )}
        </div>
      </div>

      {/* The Novel Scribe Card */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden space-y-8">
        <h3 className="text-white font-black uppercase tracking-tighter text-xl italic flex justify-between items-center">
          <span>The Novel Scribe</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
        </h3>

        {/* Minutes Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temporal Flow (Writing Time)</label>
            {isEditingMinsGoal ? (
              <div className="flex gap-1 items-center bg-black/40 p-1 rounded-lg">
                <input type="number" value={tempMinsGoal} onChange={e => setTempMinsGoal(parseInt(e.target.value) || 0)} className="w-10 bg-transparent text-xs font-black text-emerald-400 text-center outline-none" />
                <button onClick={handleUpdateMinsGoal} className="text-[8px] bg-emerald-600 px-2 py-0.5 rounded font-black text-white">SET</button>
              </div>
            ) : (
              <span onClick={() => setIsEditingMinsGoal(true)} className="text-[10px] font-bold text-emerald-500 cursor-pointer hover:text-emerald-400 transition-colors">{Math.floor(state.novelMins/60)}h / {state.profile.novelMinsGoal/60}h</span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${minsPercent}%` }} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => onLogNovelMins(30)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-700 transition-all active:scale-95">+30m</button>
            <button onClick={() => onLogNovelMins(60)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-700 transition-all active:scale-95">+1h</button>
          </div>
        </div>

        {/* Pages Progress */}
        <div className="space-y-3 pt-4 border-t border-slate-800/50">
          <div className="flex justify-between items-end">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inscribed Reality (Pages)</label>
            {isEditingPagesGoal ? (
              <div className="flex gap-1 items-center bg-black/40 p-1 rounded-lg">
                <input type="number" value={tempPagesGoal} onChange={e => setTempPagesGoal(parseInt(e.target.value) || 0)} className="w-10 bg-transparent text-xs font-black text-cyan-400 text-center outline-none" />
                <button onClick={handleUpdatePagesGoal} className="text-[8px] bg-cyan-600 px-2 py-0.5 rounded font-black text-white">SET</button>
              </div>
            ) : (
              <span onClick={() => setIsEditingPagesGoal(true)} className="text-[10px] font-bold text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">{state.novelPages} / {state.profile.novelPagesGoal} Pages</span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${pagesPercent}%` }} />
          </div>
          <div className="flex gap-2 pt-1">
            <input 
              type="number" 
              value={pagesInput || ''} 
              onChange={e => setPagesInput(parseInt(e.target.value) || 0)}
              className="w-16 bg-black/40 border border-slate-800 rounded-xl px-2 text-center text-sm font-bold text-cyan-400 outline-none focus:border-cyan-500 transition-colors"
              placeholder="0"
            />
            <button 
              onClick={handleLogPages}
              className="flex-1 py-3 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 text-[10px] font-black uppercase rounded-xl transition-all active:scale-95 shadow-lg"
            >
              Log Written Pages
            </button>
          </div>
        </div>

        {/* Motivational Lines */}
        <div className="bg-black/30 p-6 rounded-3xl border border-slate-800/50 relative mt-4">
          <div className="flex gap-4 items-start">
            <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-transparent rounded-full shrink-0 mt-1"></div>
            <div>
              <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"{currentQuote.quote}"</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-3 text-right">— {currentQuote.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
