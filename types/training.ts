export interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  type: 'gi' | 'no-gi' | 'open-mat' | 'competition' | 'drilling' | 'private';
  notes: string;
  techniques?: string[];
}

export interface TrainingStats {
  totalHours: number;
  sessionsCount: number;
  averageSessionLength: number;
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: string | null;
}

export interface TimerSettings {
  rounds: number;
  roundTime: number;
  restTime: number;
}
