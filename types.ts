
export type ExerciseType = 'push_ups' | 'pull_ups' | 'sit_ups' | 'cardio' | string;

export interface SetEntry {
  reps: number; // or KM for cardio
  timestamp: number;
}

export interface WorkoutSession {
  id: string;
  type: ExerciseType;
  date: string; // YYYY-MM-DD
  sets: SetEntry[];
  goalReps: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  isWeekly: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface ScheduleEntry {
  id: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:00"
  label: string;
  type: 'course' | 'free' | 'study';
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "14:00"
  title: string;
  notes: string;
  type: 'quiz' | 'event';
}

export interface Exam {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "09:30"
  venue: string;
  seatNo: string;
  difficulty: 'low' | 'medium' | 'high' | 'extreme';
  notes: string;
}

export interface AmbitionDot {
  id: string;
  title: string;
  timeframe: string;
  status: 'dream' | 'active' | 'achieved';
}

export interface SkillNode {
  id: string;
  name: string;
  progress: number; // 0-100
}

export interface FutureData {
  visionStatement: string;
  targetJob: string;
  ambitions: AmbitionDot[];
  skills: SkillNode[];
  futureSteps: string[];
  futureNotes: string; // Added for free-form writing about future
}

export interface StudySession {
  id: string;
  date: string;
  type: 'pomodoro' | 'mcq' | 'warmup' | 'revision' | 'cheatsheet' | string;
  durationMinutes: number;
  count?: number;
}

export interface FluteSession {
  id: string;
  date: string;
  technique: string;
  durationMinutes: number;
}

export interface NovelSession {
  id: string;
  date: string;
  minutes: number;
  pages: number;
}

export interface AppState {
  profile: UserProfile;
  sessions: WorkoutSession[];
  tasks: Task[];
  studySessions: StudySession[];
  fluteSessions: FluteSession[];
  novelSessions: NovelSession[];
  novelMins: number; 
  novelPages: number; 
  novelHistory: WeeklyNovelProgress[];
  completedDrills: string[]; 
  lastActiveDate: string;
  dailyQuote: null | DailyQuote;
  weeklyChallenges: null | WeeklyChallenges;
  lastChallengeLevel: number;
  weeklyScheduleTemplate: Record<string, ScheduleEntry[]>;
  events: CalendarEvent[];
  exams: Exam[];
  future: FutureData;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  weeklySchedule: Record<string, ExerciseType[]>;
  dailyGoals: Record<ExerciseType, number>;
  customExercises: string[];
  novelMinsGoal: number; 
  novelPagesGoal: number; 
  fluteSchedule: string[]; 
  customFluteTechniques: string[];
}

export interface DailyQuote extends MotivationQuote {
  date: string;
}

export interface WeeklyChallenges {
  physical: { id: string; text: string; completed: boolean }[];
  mental: { id: string; text: string; completed: boolean }[];
  lastRenewed: string; 
}

export interface MotivationQuote {
  quote: string;
  source: string;
  character: string;
}

export interface RoadmapItem {
  level: number;
  title: string;
  description: string;
  icon: string;
}

export interface WeeklyNovelProgress {
  weekEnding: string;
  minutes: number;
  pages: number;
}
