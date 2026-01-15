
import React, { useState, useMemo } from 'react';
import { AppState, Exam } from '../types';

interface ExamManagerProps {
  exams: Exam[];
  onAddExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onEditExam: (exam: Exam) => void;
}

const EXAM_TIPS = [
  { title: "Hydration Protocol", content: "Water intake improves cognitive clarity by 15%. Keep a bottle nearby during the grind." },
  { title: "Active Recall Loop", content: "Testing yourself is 3x more effective than re-reading. Use flashcards for key formulae." },
  { title: "The 90-Minute Sprint", content: "Focus in high-intensity blocks. Your brain's attention span resets every 90 minutes." },
  { title: "Sleep = Memory Synthesis", content: "Memories are stored during REM sleep. Do not sacrifice the last 4 hours of sleep." },
  { title: "The Hall Walk", content: "Arrive at the venue 20 mins early to normalize the environment and reduce cortisol spikes." }
];

export const ExamManager: React.FC<ExamManagerProps> = ({ exams, onAddExam, onDeleteExam, onEditExam }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [venue, setVenue] = useState('');
  const [seatNo, setSeatNo] = useState('');
  const [difficulty, setDifficulty] = useState<Exam['difficulty']>('medium');
  const [notes, setNotes] = useState('');

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exams]);

  const daysUntilFirst = useMemo(() => {
    if (sortedExams.length === 0) return null;
    const firstDate = new Date(sortedExams[0].date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = firstDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [sortedExams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Exam = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      subject, date, time, venue, seatNo, difficulty, notes
    };
    if (editingId) {
      onEditExam(payload);
    } else {
      onAddExam(payload);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setSubject(''); setDate(''); setTime('09:00'); setVenue(''); setSeatNo(''); setDifficulty('medium'); setNotes('');
  };

  const handleEdit = (exam: Exam) => {
    setEditingId(exam.id);
    setSubject(exam.subject);
    setDate(exam.date);
    setTime(exam.time);
    setVenue(exam.venue);
    setSeatNo(exam.seatNo);
    setDifficulty(exam.difficulty);
    setNotes(exam.notes);
    setIsAdding(true);
  };

  const getPriorityAnalysis = (exam: Exam, index: number) => {
    const prev = sortedExams[index - 1];
    let gapMessage = "First Battle.";
    let priorityClass = "text-blue-400";
    let priorityLabel = "NORMAL";

    if (prev) {
      const diffTime = Math.abs(new Date(exam.date).getTime() - new Date(prev.date).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      gapMessage = `${diffDays} Day Gap.`;
      
      if (diffDays <= 1 && (exam.difficulty === 'high' || exam.difficulty === 'extreme')) {
        priorityClass = "text-red-500 animate-pulse";
        priorityLabel = "CRITICAL FOCUS";
      } else if (diffDays <= 2 || exam.difficulty === 'extreme') {
        priorityClass = "text-amber-500";
        priorityLabel = "HIGH ALERT";
      }
    } else if (exam.difficulty === 'extreme') {
      priorityClass = "text-amber-500";
      priorityLabel = "HIGH ALERT";
    }

    return { gapMessage, priorityClass, priorityLabel };
  };

  return (
    <div className="p-4 space-y-8 pb-32">
      {/* SECTION 1: COUNTDOWN */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="relative z-10 text-center space-y-2">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">T-Minus to Zero Hour</h2>
          <div className="text-6xl font-orbitron font-black text-white italic tracking-tighter">
            {daysUntilFirst === null ? "N/A" : daysUntilFirst <= 0 ? "LIVE" : daysUntilFirst}
            <span className="text-lg font-bold text-blue-500 ml-2">{daysUntilFirst === 1 ? 'DAY' : 'DAYS'}</span>
          </div>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Protocol: Ultimate Readiness</p>
        </div>
      </section>

      {/* SECTION 2: TIMETABLE */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Battle Manifest (Exams)</h2>
          <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full text-[10px] font-black text-blue-400 uppercase hover:bg-blue-600/20 transition-all">+</button>
        </div>

        <div className="space-y-4">
          {sortedExams.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-800 rounded-[2.5rem] opacity-40">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">No Examination Missions Recorded</p>
            </div>
          ) : (
            sortedExams.map((exam, idx) => {
              const analysis = getPriorityAnalysis(exam, idx);
              return (
                <div key={exam.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6 space-y-4 group hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${analysis.priorityClass} bg-current/10`}>{analysis.priorityLabel}</span>
                        <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{analysis.gapMessage}</span>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{exam.subject}</h3>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(exam)} className="text-slate-500 hover:text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => onDeleteExam(exam.id)} className="text-slate-500 hover:text-red-500">✕</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/50">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Schedule</p>
                      <p className="text-[11px] font-bold text-slate-200">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} @ {exam.time}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Intelligence</p>
                      <p className="text-[11px] font-bold text-slate-200">Hall {exam.venue} / Seat {exam.seatNo}</p>
                    </div>
                  </div>

                  {exam.notes && (
                    <div className="bg-black/20 p-3 rounded-xl border border-slate-800/50">
                      <p className="text-[9px] text-slate-500 italic leading-relaxed">"{exam.notes}"</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* SECTION 3: TIPS */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Titan Study Protocols</h2>
        <div className="grid gap-4">
          {EXAM_TIPS.map((tip, i) => (
            <div key={i} className="flex gap-4 p-5 bg-slate-900 border border-slate-800 rounded-[2rem] hover:bg-slate-800/50 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0">
                <span className="text-blue-500 font-bold text-xs">0{i+1}</span>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{tip.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">{tip.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADD/EDIT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 border border-blue-500/20 space-y-5">
            <h3 className="text-xl font-orbitron font-black text-blue-400 uppercase italic">Update Manifest</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Subject / Field</label>
                <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Quantum Physics" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Date</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" />
                </div>
                <div className="w-28 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Time</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Venue No.</label>
                  <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Hall 4B" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Seat No.</label>
                  <input value={seatNo} onChange={e => setSeatNo(e.target.value)} placeholder="A-42" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Subjective Difficulty</label>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high', 'extreme'] as const).map(d => (
                    <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${difficulty === d ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-600'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Notes / Topic Focus</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                  Commit Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
