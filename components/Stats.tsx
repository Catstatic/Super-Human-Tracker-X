
import React, { useMemo, useState } from 'react';
import { AppState, ExerciseType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { EXERCISE_LABELS } from '../constants';

interface StatsProps {
  state: AppState;
}

type TabCategory = 'physique' | 'intel' | 'art';

export const Stats: React.FC<StatsProps> = ({ state }) => {
  const [activeCategory, setActiveCategory] = useState<TabCategory>('physique');

  const last7Days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  }), []);

  const physiqueData = useMemo(() => last7Days.map(date => {
    const dayData: any = { date: date.split('-').slice(2).join('/') };
    (Object.keys(EXERCISE_LABELS) as ExerciseType[]).forEach(type => {
      const sessions = state.sessions.filter(s => s.type === type && s.date === date);
      dayData[type] = sessions.reduce((acc, s) => acc + s.sets.reduce((a, b) => a + b.reps, 0), 0);
    });
    return dayData;
  }), [state.sessions, last7Days]);

  const intelData = useMemo(() => last7Days.map(date => {
    const dayData: any = { date: date.split('-').slice(2).join('/') };
    const sessions = state.studySessions.filter(s => s.date === date);
    dayData.pomodoro = sessions.filter(s => s.type === 'pomodoro').length;
    dayData.mcq = sessions.filter(s => s.type === 'mcq').reduce((acc, s) => acc + (s.count || 0), 0);
    dayData.revision = sessions.filter(s => s.type === 'revision').reduce((acc, s) => acc + s.durationMinutes, 0);
    dayData.cheatsheet = sessions.filter(s => s.type === 'cheatsheet').reduce((acc, s) => acc + (s.count || 0), 0);
    return dayData;
  }), [state.studySessions, last7Days]);

  const artData = useMemo(() => last7Days.map(date => {
    const dayData: any = { date: date.split('-').slice(2).join('/') };
    dayData.flute = state.fluteSessions
      .filter(s => s.date === date)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    dayData.novelMins = state.novelSessions
      .filter(s => s.date === date)
      .reduce((acc, s) => acc + s.minutes, 0);
    dayData.novelPages = state.novelSessions
      .filter(s => s.date === date)
      .reduce((acc, s) => acc + s.pages, 0);
    return dayData;
  }), [state.fluteSessions, state.novelSessions, last7Days]);

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="px-2">
        <h1 className="text-2xl font-orbitron font-black text-white italic tracking-tighter">TITAN ARCHIVES</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Superhuman Growth Matrix</p>
      </div>

      {/* Category Toggles */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 gap-1">
        {[
          { id: 'physique', label: 'Physique', color: 'text-blue-400' },
          { id: 'intel', label: 'Intel', color: 'text-purple-400' },
          { id: 'art', label: 'Artistry', color: 'text-amber-400' }
        ].map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as TabCategory)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Conditional Charts */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">7-Day Operational Variance</h3>
        
        <div className="h-64 w-full">
          {activeCategory === 'physique' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={physiqueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '10px' }} />
                <Bar dataKey="push_ups" fill="#3b82f6" name="Push Ups" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pull_ups" fill="#10b981" name="Pull Ups" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sit_ups" fill="#f59e0b" name="Sit Ups" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeCategory === 'intel' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intelData}>
                <defs>
                  <linearGradient id="colorIntel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="mcq" stroke="#a855f7" fillOpacity={1} fill="url(#colorIntel)" name="MCQ Blitz" />
                <Area type="monotone" dataKey="revision" stroke="#ec4899" fillOpacity={0} name="Revision (m)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeCategory === 'art' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={artData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '10px' }} />
                <Bar dataKey="flute" fill="#f59e0b" name="Bansuri (m)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="novelMins" fill="#10b981" name="Writing (m)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="novelPages" fill="#06b6d4" name="Pages" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Categorized Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {activeCategory === 'physique' && (
          <>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-blue-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly Volume</p>
              <p className="text-2xl font-orbitron font-bold text-blue-400">{state.sessions.filter(s => s.type !== 'cardio').reduce((acc, s) => acc + s.sets.reduce((a,b) => a+b.reps, 0), 0)}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Total Protocol Reps</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-cyan-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Distance Core</p>
              <p className="text-2xl font-orbitron font-bold text-cyan-400">{state.sessions.filter(s => s.type === 'cardio').reduce((acc, s) => acc + s.sets.reduce((a,b) => a+b.reps, 0), 0).toFixed(1)}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Total Kilometers</p>
            </div>
          </>
        )}

        {activeCategory === 'intel' && (
          <>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-purple-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">MCQ Decimated</p>
              <p className="text-2xl font-orbitron font-bold text-purple-400">{state.studySessions.filter(s => s.type === 'mcq').reduce((acc, s) => acc + (s.count || 0), 0)}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Questions Solved</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-pink-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Focus Time</p>
              <p className="text-2xl font-orbitron font-bold text-pink-400">{state.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0)}m</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Total Neural Grind</p>
            </div>
          </>
        )}

        {activeCategory === 'art' && (
          <>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-amber-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Sonic Reach</p>
              <p className="text-2xl font-orbitron font-bold text-amber-400">{state.fluteSessions.reduce((acc, s) => acc + s.durationMinutes, 0)}m</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Total Flute Devotion</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 group hover:border-emerald-500/50 transition-all">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">The Great Work</p>
              <p className="text-2xl font-orbitron font-bold text-emerald-400">{state.novelPages}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">Pages Inscribed</p>
            </div>
          </>
        )}
      </div>

      {/* Detailed Recent Log History */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Temporal Logs</h3>
        <div className="bg-slate-900/40 rounded-[2rem] border border-slate-800 overflow-hidden divide-y divide-slate-800/50">
          {activeCategory === 'physique' && state.sessions.slice(-5).reverse().map(s => (
             <div key={s.id} className="p-4 flex justify-between items-center hover:bg-slate-800/20">
               <div>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">{EXERCISE_LABELS[s.type] || s.type}</p>
                 <p className="text-[9px] text-slate-500">{s.date}</p>
               </div>
               <p className="text-sm font-orbitron font-black text-blue-400">{s.sets.reduce((a,b) => a+b.reps, 0)} {s.type === 'cardio' ? 'KM' : 'REPS'}</p>
             </div>
          ))}
          {activeCategory === 'intel' && state.studySessions.slice(-5).reverse().map(s => (
             <div key={s.id} className="p-4 flex justify-between items-center hover:bg-slate-800/20">
               <div>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">{s.type}</p>
                 <p className="text-[9px] text-slate-500">{s.date}</p>
               </div>
               <p className="text-sm font-orbitron font-black text-purple-400">{s.count || s.durationMinutes}{s.count ? 'x' : 'm'}</p>
             </div>
          ))}
          {activeCategory === 'art' && state.fluteSessions.slice(-5).reverse().map(s => (
             <div key={s.id} className="p-4 flex justify-between items-center hover:bg-slate-800/20">
               <div>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">{s.technique}</p>
                 <p className="text-[9px] text-slate-500">{s.date}</p>
               </div>
               <p className="text-sm font-orbitron font-black text-amber-400">{s.durationMinutes}m</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
