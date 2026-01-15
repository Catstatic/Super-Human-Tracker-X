
import React, { useState, useRef } from 'react';
import { AppState } from '../types';
import { DAYS_OF_WEEK, EXERCISE_LABELS } from '../constants';

interface ProfileProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const Profile: React.FC<ProfileProps> = ({ state, onUpdateState }) => {
  const [customInput, setCustomInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    onUpdateState({
      ...state,
      profile: {
        ...state.profile,
        customExercises: [...state.profile.customExercises, customInput]
      }
    });
    setCustomInput('');
  };

  const handleUpdateSchedule = (day: string, type: string) => {
    const current = state.profile.weeklySchedule[day] || [];
    const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    onUpdateState({ 
      ...state, 
      profile: { 
        ...state.profile, 
        weeklySchedule: { ...state.profile.weeklySchedule, [day]: updated } 
      } 
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `titan_forge_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Basic validation
        if (importedData.profile && Array.isArray(importedData.sessions)) {
          onUpdateState(importedData);
          alert('Titan Archives Restored Successfully!');
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (error) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be imported again if needed
    event.target.value = '';
  };

  const allEx = [...Object.keys(EXERCISE_LABELS), ...state.profile.customExercises];

  return (
    <div className="p-6 space-y-10 pb-32">
      <div className="space-y-1">
        <h1 className="text-3xl font-orbitron font-black text-white italic tracking-tighter uppercase">Warrior Config</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">System Calibration Protocol</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Custom Protocol Initiation</h3>
        <div className="flex gap-2 bg-slate-900/50 p-2 rounded-[1.5rem] border border-slate-800">
          <input 
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="New Core Exercise..."
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-white font-medium"
          />
          <button 
            onClick={handleAddCustom} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-1">Grand Master Schedule</h3>
        <div className="bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-slate-800 divide-y divide-slate-800/50">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="p-6 space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                {day}
              </p>
              <div className="flex flex-wrap gap-2">
                {allEx.map(ex => {
                  const isActive = state.profile.weeklySchedule[day]?.includes(ex);
                  return (
                    <button 
                      key={ex}
                      onClick={() => handleUpdateSchedule(day, ex)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 border ${isActive ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-950/50 border-slate-800 text-slate-600'}`}
                    >
                      {EXERCISE_LABELS[ex] || ex}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Titan Backup & Restore</h3>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={handleExport} 
            className="w-full py-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-emerald-400 shadow-xl transition-all active:scale-[0.98]"
          >
            Download Data Backup
          </button>
          
          <button 
            onClick={handleImportClick}
            className="w-full py-5 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-emerald-500 shadow-xl transition-all active:scale-[0.98]"
          >
            Restore Archives
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
        <p className="text-[9px] text-slate-600 text-center font-bold uppercase tracking-widest">Version Alpha // Superhuman Engine</p>
      </section>
    </div>
  );
};
