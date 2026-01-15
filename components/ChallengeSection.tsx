
import React from 'react';
import { WeeklyChallenges } from '../types';

interface ChallengeSectionProps {
  challenges: WeeklyChallenges | null;
  onToggle: (type: 'physical' | 'mental', id: string) => void;
  level: number;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ challenges, onToggle, level }) => {
  if (!challenges) return <div className="p-8 text-center text-slate-500 animate-pulse font-black uppercase tracking-[0.3em]">Calibrating Missions...</div>;

  return (
    <div className="p-4 space-y-8 pb-32">
      {/* Challenge Hero */}
      <div className="w-full aspect-[5/2] rounded-[3rem] overflow-hidden relative shadow-2xl border border-red-500/20 bg-slate-900 group">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/6493269d999d5c23aa3c3f22/0344dbea-39f1-4967-be7f-480ae5e06076/30274-picture3.png" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-[15000ms] group-hover:scale-110" 
          alt="Climbing a mountain in a storm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-10 left-10">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.8em] mb-2 drop-shadow-md">Tier {Math.ceil(level/5)} Objectives</p>
          <h2 className="text-4xl font-orbitron font-black text-white uppercase leading-none tracking-tighter"></h2>
        </div>
      </div>

      {/* Physical Challenges */}
      <section className="space-y-4">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] whitespace-nowrap">Physical Strain</h3>
          <div className="h-px w-full bg-slate-800"></div>
        </div>
        <div className="grid gap-3">
          {challenges.physical.map(c => (
            <div 
              key={c.id} 
              onClick={() => onToggle('physical', c.id)}
              className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer ${c.completed ? 'bg-slate-950 border-slate-900 opacity-40' : 'bg-slate-900 border-slate-800 hover:border-blue-500/50'}`}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${c.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-700'}`}>
                  {c.completed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <p className={`text-sm font-bold leading-relaxed ${c.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mental Challenges */}
      <section className="space-y-4">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] whitespace-nowrap">Mental Fortitude</h3>
          <div className="h-px w-full bg-slate-800"></div>
        </div>
        <div className="grid gap-3">
          {challenges.mental.map(c => (
            <div 
              key={c.id} 
              onClick={() => onToggle('mental', c.id)}
              className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer ${c.completed ? 'bg-slate-950 border-slate-900 opacity-40' : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'}`}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${c.completed ? 'bg-purple-600 border-purple-600' : 'border-slate-700'}`}>
                  {c.completed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <p className={`text-sm font-bold leading-relaxed ${c.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <p className="text-[9px] text-slate-600 text-center font-black uppercase tracking-[0.3em] mt-10">Missions synchronize with Level Gains & Weekly Reset</p>
    </div>
  );
};
