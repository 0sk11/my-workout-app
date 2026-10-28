export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core';

export type EquipmentRequirement =
  | 'dumbbell'
  | 'resistance_band'
  | 'pull_up_bar'
  | 'bodyweight'
  | 'mat'
  | 'incline_surface';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'strength' | 'bodyweight' | 'core' | 'mobility';
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentRequirement[];
  techniqueCues: string[];
  safetyNotes?: string;
  defaultRestSeconds: number;
  isTimeBased?: boolean;
  defaultRepRange: { min: number; max: number };
  defaultSets: number;
  substitutions: string[]; // Exercise IDs that can substitute this
  illustrationSvgKey: string; // Key to render clear minimalist Swiss line diagram
}

export interface WorkoutExercisePrescription {
  exerciseId: string;
  sets: number;
  targetRepRange: { min: number; max: number };
  startingWeightKg?: number; // per dumbbell or total load
  restSeconds: number;
  isOptional?: boolean; // e.g. lateral raises if shoulder fatigue occurs
  notes?: string;
  bandAssistanceLevel?: string;
  timeTargetSeconds?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: 'upper_a' | 'lower' | 'upper_b' | 'custom';
  estimatedDurationMinutes: number;
  targetFocus: string;
  warmupNotes: string[];
  exercises: WorkoutExercisePrescription[];
  isCustom?: boolean;
}

export interface CompletedSet {
  setNumber: number;
  targetReps: number;
  actualReps: number;
  weightKg: number; // 0 for bodyweight
  bandAssistanceLevel?: string;
  durationSeconds?: number;
  rir?: number; // Reps In Reserve (0 to 4+)
  completedAt: string; // ISO string
  notes?: string;
}

export interface ExerciseSessionLog {
  exerciseId: string;
  exerciseName: string;
  plannedSets: number;
  completedSets: CompletedSet[];
  skipped?: boolean;
  substitutionFor?: string;
  notes?: string;
}

export interface ReadinessCheck {
  energy: 'low' | 'normal' | 'high';
  soreness: 'none' | 'mild' | 'moderate' | 'severe';
  painSymptoms: boolean;
  painLocation?: string;
  adjustedVolume?: boolean;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  startedAt: string; // ISO string
  completedAt?: string; // ISO string
  durationSeconds: number;
  readinessCheck?: ReadinessCheck;
  exerciseLogs: ExerciseSessionLog[];
  rpe?: number; // Rate of Perceived Exertion (1 - 10)
  overallNotes?: string;
  isCompleted: boolean;
  prsAchieved?: string[];
}

export interface ActiveWorkoutState {
  session: WorkoutSession;
  currentExerciseIndex: number;
  currentSetIndex: number;
  restTimer: {
    isActive: boolean;
    endTime: number | null; // epoch timestamp ms for drift-proof timing
    totalDurationSeconds: number;
    exerciseId: string;
  } | null;
  transitionState: {
    isTransitioning: boolean;
    nextExerciseIndex: number;
    countdownEndTime: number | null;
  } | null;
  isPaused: boolean;
  pausedAtTimestamp: number | null;
  accumulatedPauseMs: number;
}
