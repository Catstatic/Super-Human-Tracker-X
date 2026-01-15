
import React, { useState } from 'react';
import { ExerciseType, SetEntry } from '../types';
import { EXERCISE_LABELS } from '../constants';
import { RestTimer } from './RestTimer';

interface ExerciseLoggerProps {
  type: ExerciseType;
  goal: number;
  onLog: (sets: SetEntry[]) => void;
  onCancel: () => void;
}

export const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ type, goal, onLog, onCancel }) => {
  const [sets, setSets] = useState<SetEntry[]>([]);
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [showTimer, setShowTimer] = useState(false);

  const isCardio = type === 'cardio';
  const unitLabel = isCardio ? 'Km' : 'Reps';
  const groupLabel = isCardio ? 'Lap' : 'Set';

  const total = sets.reduce((acc, set) => acc + set.reps, 0);

  const handleAddSet = () => {
    if (currentVal <= 0) return;
    setSets([...sets, { reps: currentVal, timestamp: Date.now() }]);
    setCurrentVal(0);
    if (!isCardio) setShowTimer(true); // Don't force rest timer for cardio laps unless user wants it
  };

  if (showTimer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <RestTimer duration={60} onComplete={() => setShowTimer(false)} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-orbitron font-bold text-blue-400">{EXERCISE_LABELS[type] || type}</h2>
        <button onClick={onCancel} className="text-slate-400">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="text-center">
          <div className="text-5xl font-orbitron font-black text-white">{total} <span className="text-lg font-normal text-slate-500">/ {goal} {unitLabel}</span></div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <label className="text-sm font-semibold text-slate-400 mb-4 block uppercase">{unitLabel} THIS {groupLabel.toUpperCase()}</label>
          <input 
            type="number" 
            step={isCardio ? "0.1" : "1"}
            value={currentVal || ''} 
            onChange={(e) => setCurrentVal(parseFloat(e.target.value) || 0)}
            className="w-full text-center bg-transparent text-5xl font-orbitron font-bold text-white focus:outline-none mb-6"
            placeholder="0"
          />
          <button 
            onClick={handleAddSet}
            disabled={currentVal <= 0}
            className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg active:scale-95 transition-all"
          >
            LOG {groupLabel.toUpperCase()}
          </button>
        </div>

        <div className="space-y-2">
          {sets.map((s, i) => (
            <div key={i} className="flex justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <span className="text-slate-500">{groupLabel} {i+1}</span>
              <span className="font-orbitron font-bold">{s.reps} {unitLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-800">
        <button onClick={() => onLog(sets)} className="w-full py-4 bg-emerald-600 rounded-xl font-black shadow-lg">FINISH PROTOCOL</button>
      </div>
    </div>
  );
};
