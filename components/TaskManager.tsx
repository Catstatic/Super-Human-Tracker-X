
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (text: string, isWeekly: boolean, priority?: 'low' | 'medium' | 'high') => void;
  onToggleTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onToggleTask, onClearCompleted }) => {
  const [input, setInput] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddTask(input, isWeekly, priority);
    setInput('');
  };

  const daily = tasks.filter(t => !t.isWeekly);
  const weekly = tasks.filter(t => t.isWeekly);
  
  const dailyCompleted = daily.filter(t => t.completed).length;
  const weeklyCompleted = weekly.filter(t => t.completed).length;

  return (
    <div className="p-6 space-y-10 pb-32">
      <div className="space-y-1">
        <h1 className="text-3xl font-orbitron font-black text-white italic tracking-tighter uppercase">Neural Intel</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Mission Control Interface</p>
      </div>

      {/* Status HUD */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-[1.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Flux</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-orbitron font-black text-blue-400">{dailyCompleted}</span>
            <span className="text-slate-600 font-bold text-xs">/ {daily.length}</span>
          </div>
          <div className="w-full h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(dailyCompleted / Math.max(daily.length, 1)) * 100}%` }} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-[1.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-2xl rounded-full"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strategic Gear</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-orbitron font-black text-amber-400">{weeklyCompleted}</span>
            <span className="text-slate-600 font-bold text-xs">/ {weekly.length}</span>
          </div>
          <div className="w-full h-1 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(weeklyCompleted / Math.max(weekly.length, 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-black/40 p-2 rounded-2xl border border-slate-800/50 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Designate New Mission..."
              className="flex-1 bg-transparent px-4 outline-none text-sm text-white py-3"
            />
            <button type="submit" className="bg-blue-600 px-6 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all">Engage</button>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-black/20 p-1 rounded-xl border border-slate-800 flex">
              <button 
                type="button" 
                onClick={() => setIsWeekly(false)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isWeekly ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}
              >
                Infiltration
              </button>
              <button 
                type="button" 
                onClick={() => setIsWeekly(true)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isWeekly ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-600'}`}
              >
                Campaign
              </button>
            </div>
            
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button 
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${priority === p ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950/50'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">Daily Protocol</h3>
          <div className="h-px w-full bg-slate-800"></div>
        </div>
        <div className="space-y-3">
          {daily.length === 0 && <p className="text-center py-10 text-[10px] text-slate-700 font-black uppercase tracking-widest">No Active Missions</p>}
          {daily.map(t => (
            <div 
              key={t.id} 
              onClick={() => onToggleTask(t.id)} 
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 group cursor-pointer ${t.completed ? 'bg-slate-950 border-slate-900 opacity-40 grayscale' : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50'}`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-slate-700'}`}>
                {t.completed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-bold block transition-all ${t.completed ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'}`}>{t.text}</span>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-1 h-1 rounded-full ${t.priority === 'high' ? 'bg-red-500 animate-pulse' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{t.priority || 'medium'} priority</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">Weekly Objectives</h3>
          <div className="h-px w-full bg-slate-800"></div>
        </div>
        <div className="space-y-3">
          {weekly.length === 0 && <p className="text-center py-10 text-[10px] text-slate-700 font-black uppercase tracking-widest">No Active Campaigns</p>}
          {weekly.map(t => (
            <div 
              key={t.id} 
              onClick={() => onToggleTask(t.id)} 
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 cursor-pointer ${t.completed ? 'bg-slate-950 border-slate-900 opacity-40' : 'bg-amber-900/5 border-amber-900/20 hover:border-amber-500/50'}`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-amber-900/40'}`}>
                {t.completed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className={`text-sm font-bold flex-1 ${t.completed ? 'line-through text-slate-600' : 'text-slate-100'}`}>{t.text}</span>
            </div>
          ))}
        </div>
      </section>
      
      <button onClick={onClearCompleted} className="w-full py-5 text-slate-600 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors border border-dashed border-slate-800 rounded-2xl">Purge Completed Directives</button>
    </div>
  );
};
