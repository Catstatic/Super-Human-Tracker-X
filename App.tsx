
import React, { useState, useEffect } from 'react';
import { AppState, ExerciseType, SetEntry, Task, StudySession, FluteSession, NovelSession, ScheduleEntry, CalendarEvent, Exam, FutureData } from './types';
import { Dashboard } from './components/Dashboard';
import { Stats } from './components/Stats';
import { Profile } from './components/Profile';
import { ExerciseLogger } from './components/ExerciseLogger';
import { WarRoom } from './components/WarRoom';
import { TaskManager } from './components/TaskManager';
import { CreativeHub } from './components/CreativeHub';
import { ChallengeSection } from './components/ChallengeSection';
import { ScheduleManager } from './components/ScheduleManager';
import { ExamManager } from './components/ExamManager';
import { FutureDecider } from './components/FutureDecider';
import { DRILLS, DAYS_OF_WEEK } from './constants';
import { getDailyMotivation, generateWeeklyChallenges } from './services/geminiService';

const STORAGE_KEY = 'titan_forge_superhuman_v13';

const INITIAL_SCHEDULE_TEMPLATE: Record<string, ScheduleEntry[]> = {};
DAYS_OF_WEEK.forEach(day => {
  INITIAL_SCHEDULE_TEMPLATE[day] = [];
});

const INITIAL_FUTURE_DATA: FutureData = {
  visionStatement: '',
  targetJob: '',
  ambitions: [],
  skills: [],
  futureSteps: [],
  futureNotes: ''
};

const INITIAL_STATE: AppState = {
  profile: {
    name: 'Young Warrior',
    level: 1,
    xp: 0,
    weeklySchedule: {
      'Monday': ['push_ups', 'cardio'],
      'Wednesday': ['pull_ups', 'sit_ups'],
      'Friday': ['push_ups', 'pull_ups', 'sit_ups']
    },
    dailyGoals: { push_ups: 100, pull_ups: 50, sit_ups: 50, cardio: 5 },
    customExercises: [],
    novelMinsGoal: 240,
    novelPagesGoal: 10,
    fluteSchedule: ['Monday', 'Wednesday', 'Friday'],
    customFluteTechniques: []
  },
  sessions: [],
  tasks: [],
  studySessions: [],
  fluteSessions: [],
  novelSessions: [],
  novelMins: 0,
  novelPages: 0,
  novelHistory: [],
  completedDrills: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyQuote: null,
  weeklyChallenges: null,
  lastChallengeLevel: 1,
  weeklyScheduleTemplate: INITIAL_SCHEDULE_TEMPLATE,
  events: [],
  exams: [],
  future: INITIAL_FUTURE_DATA
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed: AppState = saved ? JSON.parse(saved) : INITIAL_STATE;
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (parsed.lastActiveDate !== todayStr) {
      if (parsed.profile.level >= 8) {
        const missedDrills = DRILLS.length - (parsed.completedDrills?.length || 0);
        if (missedDrills > 0) {
          parsed.profile.xp = Math.max(0, parsed.profile.xp - (missedDrills * 20));
        }
      }

      const isNewWeek = new Date().getDay() === 1;
      if (isNewWeek) {
        parsed.novelHistory = [...(parsed.novelHistory || []), { weekEnding: parsed.lastActiveDate, minutes: parsed.novelMins, pages: parsed.novelPages }];
        parsed.novelMins = 0;
        parsed.novelPages = 0;
        parsed.weeklyChallenges = null; 
      }

      parsed.completedDrills = [];
      parsed.lastActiveDate = todayStr;
    }

    // Migration safety
    if (!parsed.weeklyScheduleTemplate) parsed.weeklyScheduleTemplate = INITIAL_SCHEDULE_TEMPLATE;
    if (!parsed.events) parsed.events = [];
    if (!parsed.exams) parsed.exams = [];
    if (!parsed.future) parsed.future = INITIAL_FUTURE_DATA;
    if (parsed.future && parsed.future.futureNotes === undefined) parsed.future.futureNotes = '';

    return parsed;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'exams' | 'future' | 'tasks' | 'challenges' | 'war' | 'creative' | 'stats' | 'profile'>('home');
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const needsNewChallenges = !state.weeklyChallenges || 
                               (state.weeklyChallenges.lastRenewed !== todayStr && new Date().getDay() === 1) ||
                               state.profile.level > state.lastChallengeLevel;

    if (needsNewChallenges) {
      generateWeeklyChallenges(state.profile.level).then(data => {
        setState(prev => ({
          ...prev,
          weeklyChallenges: {
            ...data,
            lastRenewed: todayStr
          },
          lastChallengeLevel: state.profile.level
        }));
      });
    }
  }, [state.profile.level, state.lastActiveDate]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!state.dailyQuote || state.dailyQuote.date !== todayStr) {
      getDailyMotivation().then(quote => {
        setState(prev => ({
          ...prev,
          dailyQuote: { ...quote, date: todayStr }
        }));
      });
    }
  }, [state.lastActiveDate]);

  const addTask = (text: string, isWeekly: boolean, priority: any = 'medium') => {
    const newTask: Task = { id: Date.now().toString(), text, completed: false, isWeekly, date: state.lastActiveDate, priority };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const toggleChallenge = (type: 'physical' | 'mental', id: string) => {
    setState(prev => {
      if (!prev.weeklyChallenges) return prev;
      const list = [...prev.weeklyChallenges[type]];
      const index = list.findIndex(c => c.id === id);
      if (index === -1) return prev;
      list[index] = { ...list[index], completed: !list[index].completed };
      
      const xpGain = list[index].completed ? 250 : -250;
      const newXp = prev.profile.xp + xpGain;
      
      return {
        ...prev,
        weeklyChallenges: { ...prev.weeklyChallenges, [type]: list },
        profile: { 
          ...prev.profile, 
          xp: Math.max(0, newXp), 
          level: Math.floor(Math.max(0, newXp)/1000) + 1 
        }
      };
    });
  };

  const updateSchedule = (day: string, entries: ScheduleEntry[]) => {
    setState(prev => ({
      ...prev,
      weeklyScheduleTemplate: { ...prev.weeklyScheduleTemplate, [day]: entries }
    }));
  };

  const updateFuture = (future: FutureData) => {
    setState(prev => ({ ...prev, future }));
  };

  const addEvent = (event: CalendarEvent) => {
    setState(prev => ({ ...prev, events: [...prev.events, event] }));
  };

  const deleteEvent = (id: string) => {
    setState(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  };

  const addExam = (exam: Exam) => {
    setState(prev => ({ ...prev, exams: [...prev.exams, exam] }));
  };

  const deleteExam = (id: string) => {
    setState(prev => ({ ...prev, exams: prev.exams.filter(e => e.id !== id) }));
  };

  const editExam = (updated: Exam) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.map(e => e.id === updated.id ? updated : e)
    }));
  };

  const logStudy = (session: Partial<StudySession>) => {
    const s: StudySession = { id: Date.now().toString(), date: state.lastActiveDate, type: session.type!, durationMinutes: session.durationMinutes!, count: session.count };
    const xpGain = 75;
    setState(prev => ({ 
      ...prev, 
      studySessions: [...prev.studySessions, s], 
      profile: { ...prev.profile, xp: prev.profile.xp + xpGain, level: Math.floor((prev.profile.xp + xpGain)/1000) + 1 } 
    }));
  };

  const logFlute = (technique: string, mins: number) => {
    const s: FluteSession = { id: Date.now().toString(), technique, durationMinutes: mins, date: state.lastActiveDate };
    setState(prev => ({ 
      ...prev, 
      fluteSessions: [...prev.fluteSessions, s], 
      profile: { ...prev.profile, xp: prev.profile.xp + mins, level: Math.floor((prev.profile.xp + mins)/1000) + 1 } 
    }));
  };

  const logNovelMins = (mins: number) => {
    const novelSess: NovelSession = { id: Date.now().toString(), date: state.lastActiveDate, minutes: mins, pages: 0 };
    setState(prev => ({ 
      ...prev, 
      novelMins: prev.novelMins + mins,
      novelSessions: [...prev.novelSessions, novelSess],
      profile: { ...prev.profile, xp: prev.profile.xp + mins, level: Math.floor((prev.profile.xp + mins)/1000) + 1 } 
    }));
  };

  const logNovelPages = (pages: number) => {
    const novelSess: NovelSession = { id: Date.now().toString(), date: state.lastActiveDate, minutes: 0, pages: pages };
    const xpGain = pages * 60;
    setState(prev => ({
      ...prev,
      novelPages: (prev.novelPages || 0) + pages,
      novelSessions: [...prev.novelSessions, novelSess],
      profile: { ...prev.profile, xp: prev.profile.xp + xpGain, level: Math.floor((prev.profile.xp + xpGain)/1000) + 1 }
    }));
  };

  const toggleDrill = (drillName: string) => {
    setState(prev => {
      const alreadyDone = prev.completedDrills.includes(drillName);
      const updated = alreadyDone 
        ? prev.completedDrills.filter(d => d !== drillName)
        : [...prev.completedDrills, drillName];
      const xpGain = alreadyDone ? -15 : 25;
      return {
        ...prev,
        completedDrills: updated,
        profile: { ...prev.profile, xp: prev.profile.xp + xpGain, level: Math.floor((prev.profile.xp + xpGain)/1000) + 1 }
      };
    });
  };

  const handleLogExercise = (type: ExerciseType, sets: SetEntry[]) => {
    const total = sets.reduce((a, s) => a + s.reps, 0);
    const xpGain = total * 3;
    const newSession = { id: Date.now().toString(), type, date: state.lastActiveDate, sets, goalReps: state.profile.dailyGoals[type] || 0 };
    setState(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      profile: { ...prev.profile, xp: prev.profile.xp + xpGain, level: Math.floor((prev.profile.xp + xpGain)/1000) + 1 }
    }));
    setActiveExercise(null);
  };

  const handleUpdateProfile = (newProfile: AppState['profile']) => {
    setState(prev => ({ ...prev, profile: newProfile }));
  };

  const currentLevel = state.profile.level;
  const isGodTier = currentLevel >= 30;
  const isVoidTheme = currentLevel >= 20;

  return (
    <div className={`max-w-md mx-auto h-screen text-white flex flex-col overflow-hidden font-inter select-none shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-1000 ${isGodTier ? 'bg-amber-950/20 ring-4 ring-amber-500/20' : isVoidTheme ? 'bg-black' : 'bg-slate-950'}`}>
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'home' && <Dashboard state={state} onStartExercise={setActiveExercise} onToggleDrill={toggleDrill} />}
        {activeTab === 'schedule' && <ScheduleManager state={state} onUpdateSchedule={updateSchedule} onAddEvent={addEvent} onDeleteEvent={deleteEvent} />}
        {activeTab === 'exams' && <ExamManager exams={state.exams} onAddExam={addExam} onDeleteExam={deleteExam} onEditExam={editExam} />}
        {activeTab === 'future' && <FutureDecider data={state.future} onUpdate={updateFuture} />}
        {activeTab === 'tasks' && <TaskManager tasks={state.tasks} onAddTask={addTask} onToggleTask={toggleTask} onClearCompleted={() => setState(p => ({...p, tasks: p.tasks.filter(t => !t.completed)}))} />}
        {activeTab === 'challenges' && <ChallengeSection challenges={state.weeklyChallenges} onToggle={toggleChallenge} level={state.profile.level} />}
        {activeTab === 'war' && <WarRoom onLogSession={logStudy} level={state.profile.level} />}
        {activeTab === 'creative' && <CreativeHub state={state} onLogFlute={logFlute} onLogNovelMins={logNovelMins} onLogNovelPages={logNovelPages} onUpdateProfile={handleUpdateProfile} />}
        {activeTab === 'stats' && <Stats state={state} />}
        {activeTab === 'profile' && <Profile state={state} onUpdateState={setState} />}
      </main>

      <nav className={`h-[85px] backdrop-blur-3xl border-t flex items-center justify-around px-1 pb-4 z-50 transition-colors duration-1000 ${isGodTier ? 'bg-amber-950/90 border-amber-500/30' : isVoidTheme ? 'bg-black/90 border-white/5' : 'bg-slate-900/90 border-white/5'}`}>
        {[
          { id: 'home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label: 'Forge' },
          { id: 'schedule', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z', label: 'Day' },
          { id: 'exams', icon: 'M18 19H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-1-11h-4v4h4V8zm0 6h-4v2h4v-2zM11 8H7v2h4V8zm0 4H7v2h4v-2zm0 4H7v2h4v-2z', label: 'Exam' },
          { id: 'future', icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z', label: 'Destiny' },
          { id: 'tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Intel' },
          { id: 'challenges', icon: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', label: 'Trial' },
          { id: 'war', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'War' },
          { id: 'creative', icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z', label: 'Art' },
          { id: 'stats', icon: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z', label: 'Logs' },
          { id: 'profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', label: 'Base' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 h-full justify-center ${activeTab === tab.id ? (isGodTier ? 'text-amber-400' : isVoidTheme ? 'text-cyan-400' : 'text-blue-400') : 'text-slate-500'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === tab.id ? (isGodTier ? 'bg-amber-400/15 scale-110' : isVoidTheme ? 'bg-cyan-400/15 scale-110' : 'bg-blue-400/15 scale-110') : 'hover:bg-white/5'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d={tab.icon} />
              </svg>
            </div>
            <span className={`text-[7px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {activeExercise && <ExerciseLogger type={activeExercise} goal={state.profile.dailyGoals[activeExercise] || 0} onLog={(s) => handleLogExercise(activeExercise, s)} onCancel={() => setActiveExercise(null)} />}
    </div>
  );
};

export default App;
