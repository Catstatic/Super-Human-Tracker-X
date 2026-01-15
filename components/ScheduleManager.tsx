
import React, { useState } from 'react';
import { AppState, ScheduleEntry, CalendarEvent } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface ScheduleManagerProps {
  state: AppState;
  onUpdateSchedule: (day: string, entries: ScheduleEntry[]) => void;
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ state, onUpdateSchedule, onAddEvent, onDeleteEvent }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Form states
  const [newLabel, setNewLabel] = useState('');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [newType, setNewType] = useState<'course' | 'free' | 'study'>('course');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('12:00');
  const [eventNotes, setEventNotes] = useState('');
  const [eventType, setEventType] = useState<'quiz' | 'event'>('event');

  const handleAddEntry = () => {
    const entry: ScheduleEntry = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: newStart,
      endTime: newEnd,
      label: newLabel,
      type: newType
    };
    const current = state.weeklyScheduleTemplate[selectedDay] || [];
    onUpdateSchedule(selectedDay, [...current, entry].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setIsAddingEntry(false);
    setNewLabel('');
  };

  const handleCreateEvent = () => {
    onAddEvent({
      id: Math.random().toString(36).substr(2, 9),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      notes: eventNotes,
      type: eventType
    });
    setIsAddingEvent(false);
    setEventTitle('');
    setEventNotes('');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = state.weeklyScheduleTemplate[today] || [];
  
  // Filter events for current week
  const todayDate = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(todayDate.getDate() + 7);
  
  const upcomingEvents = state.events.filter(e => {
    const d = new Date(e.date);
    return d >= new Date(todayDate.setHours(0,0,0,0)) && d <= weekEnd;
  }).sort((a,b) => a.date.localeCompare(b.date));

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'course': return 'text-blue-400 border-blue-500/30 bg-blue-500/5';
      case 'study': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      case 'free': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      default: return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  return (
    <div className="p-4 space-y-10 pb-32">
      {/* SECTION 1: TODAY'S OPERATIONAL WINDOW */}
      <section className="space-y-4">
        <div className="px-2">
          <h2 className="text-2xl font-orbitron font-black text-white italic tracking-tighter uppercase">CHRONOS: {today}</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Active Directive</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
          {todaySchedule.length === 0 ? (
            <div className="text-center py-10 opacity-30 grayscale italic">
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No Active Protocol Logged</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaySchedule.map(entry => (
                <div key={entry.id} className={`flex items-center gap-5 p-5 rounded-3xl border transition-all hover:scale-[1.01] ${getTypeColor(entry.type)}`}>
                  <div className="text-center w-16 shrink-0 border-r border-white/5 pr-4">
                    <p className="text-[11px] font-black text-white">{entry.startTime}</p>
                    <div className="h-4 w-px bg-current mx-auto opacity-10 my-1"></div>
                    <p className="text-[11px] font-black text-white">{entry.endTime}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-widest text-white">{entry.label}</p>
                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.2em] mt-1">{entry.type} window</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: BATTLE INTEL (QUIZZES & EVENTS) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Battle Intel (Current Week)</h2>
          <button onClick={() => setIsAddingEvent(true)} className="w-8 h-8 rounded-full border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all shadow-lg shadow-red-950/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
          {upcomingEvents.length === 0 ? (
            <div className="w-full text-center py-12 bg-slate-900/20 border border-dashed border-slate-800 rounded-[2.5rem]">
              <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest italic">Scanning for Priority Intel...</p>
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className={`shrink-0 w-64 p-6 rounded-[2.5rem] border relative overflow-hidden group shadow-2xl transition-all hover:border-red-500/40 ${event.type === 'quiz' ? 'bg-red-950/10 border-red-500/20' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${event.type === 'quiz' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>{event.type}</span>
                  <button onClick={() => onDeleteEvent(event.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1">✕</button>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">{event.title}</h4>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                   <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                     {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} @ {event.time}
                   </p>
                </div>
                {event.notes && <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-white/5 pt-3 line-clamp-2">"{event.notes}"</p>}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 3: WEEKLY BLUEPRINT (TEMPLATE) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Weekly Blueprint (Template)</h2>
          <button onClick={() => setIsAddingEntry(true)} className="px-4 py-1.5 rounded-full border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/10 transition-all">Add directive</button>
        </div>

        <div className="flex bg-slate-900/50 p-2 rounded-[1.5rem] border border-slate-800 gap-1 mb-4 overflow-x-auto no-scrollbar shadow-inner">
          {DAYS_OF_WEEK.map(day => (
            <button 
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDay === day ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-600 hover:text-slate-400'}`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {(state.weeklyScheduleTemplate[selectedDay] || []).length === 0 ? (
            <div className="text-center py-16 opacity-20 grayscale border border-dashed border-slate-800 rounded-[2.5rem]">
               <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Blueprint Uncharted for {selectedDay}</p>
            </div>
          ) : (
            (state.weeklyScheduleTemplate[selectedDay] || []).map(entry => (
              <div key={entry.id} className="flex items-center gap-5 p-5 bg-slate-900/40 border border-slate-800 rounded-[2rem] group relative hover:border-blue-500/20 transition-colors">
                <div className="w-16 shrink-0 text-right opacity-60">
                  <p className="text-[10px] font-bold text-slate-400">{entry.startTime}</p>
                  <p className="text-[10px] font-bold text-slate-400">{entry.endTime}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-200">{entry.label}</p>
                  <p className={`text-[9px] font-black uppercase ${entry.type === 'study' ? 'text-purple-400' : entry.type === 'free' ? 'text-emerald-400' : 'text-blue-400'}`}>{entry.type}</p>
                </div>
                <button 
                  onClick={() => onUpdateSchedule(selectedDay, state.weeklyScheduleTemplate[selectedDay].filter(e => e.id !== entry.id))}
                  className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all p-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODALS (UNCHANGED LOGIC, JUST AESTHETICS) */}
      {isAddingEntry && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 border border-blue-500/20 space-y-6 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <h3 className="text-xl font-orbitron font-black text-blue-400 uppercase italic">Log Blueprint Directive</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Mission Label</label>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Physics, Grind, Meditation..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-colors text-white" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Start</label>
                  <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">End</label>
                  <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Operational Type</label>
                <div className="flex gap-2">
                  {['course', 'study', 'free'].map(t => (
                    <button key={t} onClick={() => setNewType(t as any)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase border transition-all ${newType === t ? 'bg-blue-600 text-white border-blue-500 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddingEntry(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
              <button onClick={handleAddEntry} disabled={!newLabel} className="flex-[2] py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 transition-all">Engage</button>
            </div>
          </div>
        </div>
      )}

      {isAddingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 border border-red-500/20 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <h3 className="text-xl font-orbitron font-black text-red-500 uppercase italic">Priority Intel</h3>
            <div className="space-y-4">
              <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Quiz Title, Mission Objective..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-red-500 text-white" />
              <div className="flex gap-3">
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white" />
                <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-28 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white" />
              </div>
              <textarea value={eventNotes} onChange={e => setEventNotes(e.target.value)} placeholder="Intel specifics (topics, materials, etc.)" className="w-full h-24 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-red-500 resize-none text-white" />
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button onClick={() => setEventType('quiz')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${eventType === 'quiz' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-600'}`}>Quiz</button>
                <button onClick={() => setEventType('event')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${eventType === 'event' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600'}`}>Event</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddingEvent(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
              <button onClick={handleCreateEvent} disabled={!eventTitle} className="flex-[2] py-4 bg-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50 transition-all">Add Intel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
