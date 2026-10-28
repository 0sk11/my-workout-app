export type RunType =
  | 'easy'
  | 'recovery'
  | 'long_run'
  | 'tempo'
  | 'interval'
  | 'strides';

export interface WarmupExercise {
  id: string;
  name: string;
  durationSeconds?: number;
  repsOrDistance?: string;
  cues: string;
}

export interface CooldownExercise {
  id: string;
  name: string;
  durationSeconds: number;
  cues: string;
}

export interface RunInterval {
  id: string;
  name: string;
  type: 'warmup' | 'work' | 'recovery' | 'cooldown';
  durationSeconds: number;
  targetPaceDescription?: string;
  targetHrZone?: string;
}

export interface RunningWorkoutTemplate {
  id: string;
  title: string;
  runType: RunType;
  description: string;
  targetDurationMinutes: number;
  targetDistanceKm?: number;
  perceivedEffortTarget: string; // e.g. "Zone 2 conversational"
  warmupRoutine: WarmupExercise[];
  mainBlocks: RunInterval[];
  cooldownRoutine: CooldownExercise[];
  isCustom?: boolean;
}

export interface RunningSessionLog {
  id: string;
  templateId?: string;
  runType: RunType;
  title: string;
  date: string; // ISO string
  durationSeconds: number;
  distanceKm?: number;
  averagePaceMinPerKm?: string; // e.g. "5:45"
  averageHeartRateBpm?: number;
  rpe: number; // 1 to 10
  warmupCompleted: boolean;
  cooldownCompleted: boolean;
  notes?: string;
  plyometricsCompleted?: boolean;
}

export type RunTimerPhase =
  | 'idle'
  | 'warmup'
  | 'main'
  | 'interval_work'
  | 'interval_rest'
  | 'cooldown'
  | 'completed';

export interface ActiveRunState {
  template: RunningWorkoutTemplate;
  phase: RunTimerPhase;
  currentIntervalIndex: number;
  phaseRemainingSeconds: number;
  totalElapsedSeconds: number;
  isRunning: boolean;
  warmupStepIndex: number;
  cooldownStepIndex: number;
}
