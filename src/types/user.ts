export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ScheduledActivityType =
  | 'upper_a'
  | 'lower'
  | 'upper_b'
  | 'easy_run'
  | 'long_run'
  | 'intervals'
  | 'tempo_run'
  | 'recovery_run'
  | 'plyometrics'
  | 'rest';

export interface ScheduledDay {
  day: DayOfWeek;
  dayLabel: string;
  primaryActivity: ScheduledActivityType;
  secondaryActivity?: ScheduledActivityType;
}

export interface UserProfile {
  trainingLevel: 'beginner' | 'intermediate';
  primaryGoal: string;
  secondaryGoal: string;
  strengthSessionsPerWeek: number;
  runningDaysPerWeek: number;
  sessionDurationMinutes: number;
  currentPushUpMax: number;
  currentPullUpBandAssistedReps: number;
  notes: string;
}

export interface AppSettings {
  units: 'metric' | 'imperial';
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartRestTimer: boolean;
  transitionCountdownSeconds: number; // 0 to disable
  defaultRestExtensionSeconds: 15 | 30;
  speakTimerCues: boolean;
}

export interface ProgressionRecommendation {
  exerciseId: string;
  exerciseName: string;
  currentLoadKg: number;
  recommendedLoadKg: number;
  currentReps: number;
  recommendedRepRange: { min: number; max: number };
  progressionType: 'weight_increase' | 'rep_increase' | 'band_reduction' | 'hold_load' | 'deload';
  reason: string;
  calculatedAt: string;
}

export interface ScheduleConflictWarning {
  type: 'lower_before_long_run' | 'plyo_before_hard_run' | 'back_to_back_upper';
  severity: 'warning' | 'info';
  message: string;
  suggestion: string;
}
