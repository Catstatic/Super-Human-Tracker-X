
import React from 'react';
import { ExerciseType, RoadmapItem } from './types';

export const EXERCISE_LABELS: Record<string, string> = {
  push_ups: 'Push Ups',
  pull_ups: 'Pull Ups',
  sit_ups: 'Sit Ups',
  cardio: 'Cardio (Laps/Km)'
};

export const EXERCISE_ICONS: Record<string, React.ReactNode> = {
  push_ups: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  pull_ups: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  sit_ups: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  cardio: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  )
};

export const FLUTE_TECHNIQUES = [
  'Alankar (Basic Scales)',
  'Meend (Glissando)',
  'Kan Swar (Grace Notes)',
  'Gamak (Vibrato)',
  'Thaat (Modes)',
  'Taan (Fast Patterns)'
];

export const DRILLS = [
  { name: 'High Knees', duration: '60s', focus: 'Hip Flexors' },
  { name: 'Butt Kicks', duration: '60s', focus: 'Quads' },
  { name: 'Sprints', duration: '30s x 3', focus: 'Explosiveness' },
  { name: 'Mountain Climbers', duration: '45s', focus: 'Core Stability' },
  { name: 'Burpees', duration: '15 Reps', focus: 'Full Body' },
  { name: 'Jumping Jacks', duration: '100 Reps', focus: 'Conditioning' },
  { name: 'Lateral Skaters', duration: '60s', focus: 'Side Power' },
  { name: 'Shadow Boxing', duration: '3 Mins', focus: 'Agility' },
  { name: 'Plank Jacks', duration: '45s', focus: 'Core Endurance' },
  { name: 'A-Skips', duration: '50m x 2', focus: 'Running Form' }
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const LEVEL_ROADMAP: RoadmapItem[] = [
  { level: 2, title: "Zen Master Interface", description: "Subtle fluid UI animations and haptic-style feedback.", icon: "✨" },
  { level: 3, title: "Titan's Insight AI", description: "Advanced session analysis and rest-period optimization.", icon: "🧠" },
  { level: 4, title: "Harmonic Flow Correlator", description: "Correlate creative peaks with physical strength gains.", icon: "🌊" },
  { level: 5, title: "Superhuman Ascension", description: "Unlock Ultra-Dark mode and specialized breathing drills.", icon: "⚡" },
  { level: 6, title: "Intensity Overload", description: "Higher-tier cardio drills and endurance multipliers.", icon: "🔥" },
  { level: 7, title: "Dynamic Recovery", description: "Strategic rest calculation based on heart-rate simulations.", icon: "🧘" },
  { level: 8, title: "Punishment Chamber", description: "Negative reinforcement protocol for missed daily goals.", icon: "⛓️" },
  { level: 9, title: "Creative Synergy", description: "AI-generated novel prompts and flute raga suggestions.", icon: "🎨" },
  { level: 10, title: "Immortal Protocol", description: "Auto-adjusting gravity-based resistance goals.", icon: "🏛️" },
  { level: 12, title: "Cognitive Warmups", description: "Mental exercises to prime the brain for deep study.", icon: "☄️" },
  { level: 15, title: "Dual-Focus Mode", description: "Track two simultaneous growth streams for hybrid training.", icon: "♊" },
  { level: 18, title: "Biometric Matrix", description: "Simulated effort zones and metabolic stress tracking.", icon: "🧬" },
  { level: 20, title: "Transmutation Themes", description: "Unlock Nebula, Volcanic, and Void interface themes.", icon: "🌈" },
  { level: 25, title: "Spartan Discipline", description: "Strict streak requirements with massive XP multipliers.", icon: "⚔️" },
  { level: 30, title: "God-Tier Ascension", description: "Final UI transformation. You are the ultimate Titan.", icon: "👑" }
];
