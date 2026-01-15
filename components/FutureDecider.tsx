
import React, { useState } from 'react';
import { FutureData, AmbitionDot, SkillNode } from '../types';

interface FutureDeciderProps {
  data: FutureData;
  onUpdate: (data: FutureData) => void;
}

export const FutureDecider: React.FC<FutureDeciderProps> = ({ data, onUpdate }) => {
  const [newAmbition, setNewAmbition] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const updateField = (field: keyof FutureData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const addAmbition = () => {
    if (!newAmbition.trim()) return;
    const dot: AmbitionDot = {
      id: Date.now().toString(),
      title: newAmbition,
      timeframe: 'TBD',
      status: 'dream'
    };
    updateField('ambitions', [...data.ambitions, dot]);
    setNewAmbition('');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const node: SkillNode = {
      id: Date.now().toString(),
      name: newSkill,
      progress: 10
    };
    updateField('skills', [...data.skills, node]);
    setNewSkill('');
  };

  const toggleAmbition = (id: string) => {
    const updated = data.ambitions.map(a => {
      if (a.id === id) {
        const nextStatus: AmbitionDot['status'] = a.status === 'dream' ? 'active' : a.status === 'active' ? 'achieved' : 'dream';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    updateField('ambitions', updated);
  };

  const deleteAmbition = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateField('ambitions', data.ambitions.filter(a => a.id !== id));
  };

  const deleteSkill = (id: string) => {
    updateField('skills', data.skills.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 space-y-10 pb-32">
      {/* FUTURE HERO HEADER */}
      <div className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl border border-cyan-500/20 bg-slate-900 group">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-[20000ms] group-hover:scale-110" 
          alt="Distant Galaxy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.8em] mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Phase: Omega Convergence</p>
          <h2 className="text-4xl font-orbitron font-black text-white uppercase leading-none tracking-tighter italic">THE DESTINY MANIFEST</h2>
        </div>
      </div>

      {/* VISION SCRIPT (PRIMARY) */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full"></div>
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Primary Vision Script</h3>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        </div>
        <textarea 
          value={data.visionStatement}
          onChange={e => updateField('visionStatement', e.target.value)}
          placeholder="Script the truth of your arrival... Describe your reality as if it is now."
          className="w-full h-32 bg-transparent text-slate-100 italic text-base leading-relaxed outline-none resize-none placeholder:text-slate-700 font-medium"
        />
        <div className="pt-6 border-t border-slate-800/50">
           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Designated Career Apex</label>
           <input 
             value={data.targetJob}
             onChange={e => updateField('targetJob', e.target.value)}
             placeholder="Supreme Title / Job..."
             className="w-full bg-black/40 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-cyan-400 font-black uppercase tracking-widest outline-none focus:border-cyan-500 transition-all shadow-inner"
           />
        </div>
      </section>

      {/* STRATEGIC AMBITIONS (DOTS) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Ambitions</h2>
          <div className="flex gap-2">
            <input 
              value={newAmbition}
              onChange={e => setNewAmbition(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addAmbition()}
              placeholder="Next ambition..."
              className="bg-slate-950 border border-slate-800 rounded-full px-5 py-2 text-[10px] text-white outline-none focus:border-cyan-500 w-36 shadow-inner"
            />
            <button onClick={addAmbition} className="w-10 h-10 rounded-full bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-lg font-black hover:bg-cyan-600/20 transition-all shadow-lg">+</button>
          </div>
        </div>
        <div className="grid gap-4 px-2">
          {data.ambitions.map(dot => (
            <div 
              key={dot.id}
              onClick={() => toggleAmbition(dot.id)}
              className={`p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex items-center gap-5 group shadow-xl ${dot.status === 'achieved' ? 'bg-emerald-950/20 border-emerald-500/20 opacity-60' : dot.status === 'active' ? 'bg-cyan-900/10 border-cyan-500/50 scale-[1.02] shadow-cyan-950/20' : 'bg-slate-900 border-slate-800'}`}
            >
              <div className={`w-3 h-3 rounded-full shrink-0 ${dot.status === 'achieved' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : dot.status === 'active' ? 'bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'bg-slate-700'}`}></div>
              <div className="flex-1">
                <p className={`text-sm font-black uppercase tracking-tight ${dot.status === 'achieved' ? 'text-slate-400' : 'text-white'}`}>{dot.title}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">{dot.status}</p>
              </div>
              <button 
                onClick={(e) => deleteAmbition(e, dot.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all p-2"
              >✕</button>
            </div>
          ))}
        </div>
      </section>

      {/* FUTURE JOURNAL (FREE FORM) */}
      <section className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-6 relative overflow-hidden shadow-2xl">
         <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Future Log (The Grind Diary)</h3>
            <svg className="w-5 h-5 text-indigo-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
         </div>
         <textarea 
          value={data.futureNotes}
          onChange={e => updateField('futureNotes', e.target.value)}
          placeholder="Deep thoughts on the road to superhuman level... Ambitions, obstacles, philosophical shifts."
          className="w-full h-48 bg-transparent text-slate-400 text-sm leading-relaxed outline-none resize-none placeholder:text-slate-800 font-medium"
        />
        <div className="text-[8px] text-slate-700 font-black uppercase tracking-widest text-right">Encrypted Neural Storage</div>
      </section>

      {/* SKILL MATRIX (NEURAL NODES) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Skill Matrix</h2>
          <div className="flex gap-2">
             <input 
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addSkill()}
              placeholder="New skill..."
              className="bg-slate-950 border border-slate-800 rounded-full px-5 py-2 text-[10px] text-white outline-none focus:border-purple-500 w-32 shadow-inner"
            />
            <button onClick={addSkill} className="w-10 h-10 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-400 text-lg font-black hover:bg-purple-600/20 shadow-lg">+</button>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-2xl">
          {data.skills.map(skill => (
            <div key={skill.id} className="space-y-3 group relative">
              <div className="flex justify-between items-end px-1">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{skill.name}</span>
                <span className="text-[10px] font-orbitron font-bold text-purple-400">{skill.progress}%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-slate-800/50 shadow-inner">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={skill.progress}
                  onChange={e => {
                    const updated = data.skills.map(s => s.id === skill.id ? { ...s, progress: parseInt(e.target.value) } : s);
                    updateField('skills', updated);
                  }}
                  className="w-full h-full appearance-none bg-transparent cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 ${skill.progress}%, transparent ${skill.progress}%)`
                  }}
                />
              </div>
              <button 
                onClick={() => deleteSkill(skill.id)}
                className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all"
              >✕</button>
            </div>
          ))}
          {data.skills.length === 0 && (
             <div className="text-center py-10 opacity-30 grayscale italic border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Skill Matrix Offline</p>
             </div>
          )}
        </div>
      </section>

      {/* TEMPORAL STEPS (TIMELINE) */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Temporal Milestones</h2>
        <div className="space-y-4 px-2">
          {data.futureSteps.map((step, i) => (
            <div key={i} className="flex gap-5 p-6 bg-slate-900 border border-slate-800 rounded-[2rem] items-center group shadow-xl hover:border-cyan-500/20 transition-all">
               <span className="text-xs font-black text-cyan-500 w-8 italic">0{i+1}</span>
               <input 
                 value={step}
                 onChange={e => {
                   const updated = [...data.futureSteps];
                   updated[i] = e.target.value;
                   updateField('futureSteps', updated);
                 }}
                 className="flex-1 bg-transparent text-sm font-bold text-slate-200 outline-none"
               />
               <button 
                onClick={() => updateField('futureSteps', data.futureSteps.filter((_, idx) => idx !== i))}
                className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all p-1"
               >✕</button>
            </div>
          ))}
          <button 
            onClick={() => updateField('futureSteps', [...data.futureSteps, 'Future Target...'])}
            className="w-full py-6 bg-slate-900/30 border border-dashed border-slate-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-inner"
          >
            Bridge to Tomorrow +
          </button>
        </div>
      </section>

      <div className="mt-16 text-center space-y-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">"The dots only connect looking backward."</p>
         <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">— Titan Directive 01</p>
      </div>
    </div>
  );
};
