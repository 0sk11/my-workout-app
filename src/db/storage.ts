import { WorkoutTemplate, WorkoutSession, ActiveWorkoutState } from '../types/workout';
import { RunningWorkoutTemplate, RunningSessionLog } from '../types/running';
import { PlyometricSessionLog, PlyometricDrill } from '../types/plyometrics';
import { EquipmentInventory } from '../types/equipment';
import { UserProfile, ScheduledDay, AppSettings, ProgressionRecommendation } from '../types/user';
import {
  INITIAL_STRENGTH_WORKOUTS,
  INITIAL_RUNNING_WORKOUTS,
  INITIAL_PLYOMETRIC_DRILLS,
  INITIAL_EQUIPMENT,
  INITIAL_USER_PROFILE,
  INITIAL_SCHEDULE,
  INITIAL_SETTINGS
} from './initialData';

const KEYS = {
  STRENGTH_WORKOUTS: 'mwa_strength_workouts',
  RUNNING_WORKOUTS: 'mwa_running_workouts',
  PLYO_DRILLS: 'mwa_plyo_drills',
  EQUIPMENT: 'mwa_equipment',
  USER_PROFILE: 'mwa_user_profile',
  SCHEDULE: 'mwa_schedule',
  SETTINGS: 'mwa_settings',
  WORKOUT_HISTORY: 'mwa_workout_history',
  RUNNING_HISTORY: 'mwa_running_history',
  PLYO_HISTORY: 'mwa_plyo_history',
  ACTIVE_WORKOUT: 'mwa_active_workout',
  PROGRESSION_RECS: 'mwa_progression_recs'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Strength Workouts
  getStrengthWorkouts(): WorkoutTemplate[] {
    return safeGet<WorkoutTemplate[]>(KEYS.STRENGTH_WORKOUTS, INITIAL_STRENGTH_WORKOUTS);
  },
  saveStrengthWorkouts(workouts: WorkoutTemplate[]): void {
    safeSet(KEYS.STRENGTH_WORKOUTS, workouts);
  },
  resetStrengthWorkouts(): WorkoutTemplate[] {
    safeSet(KEYS.STRENGTH_WORKOUTS, INITIAL_STRENGTH_WORKOUTS);
    return INITIAL_STRENGTH_WORKOUTS;
  },

  // Running Workouts
  getRunningWorkouts(): RunningWorkoutTemplate[] {
    return safeGet<RunningWorkoutTemplate[]>(KEYS.RUNNING_WORKOUTS, INITIAL_RUNNING_WORKOUTS);
  },
  saveRunningWorkouts(workouts: RunningWorkoutTemplate[]): void {
    safeSet(KEYS.RUNNING_WORKOUTS, workouts);
  },

  // Plyometric Drills
  getPlyometricDrills(): PlyometricDrill[] {
    return safeGet<PlyometricDrill[]>(KEYS.PLYO_DRILLS, INITIAL_PLYOMETRIC_DRILLS);
  },
  savePlyometricDrills(drills: PlyometricDrill[]): void {
    safeSet(KEYS.PLYO_DRILLS, drills);
  },

  // Equipment
  getEquipment(): EquipmentInventory {
    return safeGet<EquipmentInventory>(KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  },
  saveEquipment(equipment: EquipmentInventory): void {
    safeSet(KEYS.EQUIPMENT, equipment);
  },

  // User Profile
  getUserProfile(): UserProfile {
    return safeGet<UserProfile>(KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  },
  saveUserProfile(profile: UserProfile): void {
    safeSet(KEYS.USER_PROFILE, profile);
  },

  // Schedule
  getSchedule(): ScheduledDay[] {
    return safeGet<ScheduledDay[]>(KEYS.SCHEDULE, INITIAL_SCHEDULE);
  },
  saveSchedule(schedule: ScheduledDay[]): void {
    safeSet(KEYS.SCHEDULE, schedule);
  },

  // Settings
  getSettings(): AppSettings {
    return safeGet<AppSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: AppSettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },

  // Strength Workout History
  getWorkoutHistory(): WorkoutSession[] {
    return safeGet<WorkoutSession[]>(KEYS.WORKOUT_HISTORY, []);
  },
  saveWorkoutSession(session: WorkoutSession): void {
    const history = this.getWorkoutHistory();
    // Prepend new session
    const updated = [session, ...history.filter(s => s.id !== session.id)];
    safeSet(KEYS.WORKOUT_HISTORY, updated);
  },
  deleteWorkoutSession(id: string): void {
    const history = this.getWorkoutHistory();
    safeSet(KEYS.WORKOUT_HISTORY, history.filter(s => s.id !== id));
  },

  // Running History
  getRunningHistory(): RunningSessionLog[] {
    return safeGet<RunningSessionLog[]>(KEYS.RUNNING_HISTORY, []);
  },
  saveRunningSession(session: RunningSessionLog): void {
    const history = this.getRunningHistory();
    const updated = [session, ...history.filter(s => s.id !== session.id)];
    safeSet(KEYS.RUNNING_HISTORY, updated);
  },

  // Plyometric History
  getPlyoHistory(): PlyometricSessionLog[] {
    return safeGet<PlyometricSessionLog[]>(KEYS.PLYO_HISTORY, []);
  },
  savePlyoSession(session: PlyometricSessionLog): void {
    const history = this.getPlyoHistory();
    const updated = [session, ...history.filter(s => s.id !== session.id)];
    safeSet(KEYS.PLYO_HISTORY, updated);
  },

  // Active Workout Session (for refresh/crash recovery)
  getActiveWorkout(): ActiveWorkoutState | null {
    return safeGet<ActiveWorkoutState | null>(KEYS.ACTIVE_WORKOUT, null);
  },
  saveActiveWorkout(state: ActiveWorkoutState | null): void {
    if (state === null) {
      localStorage.removeItem(KEYS.ACTIVE_WORKOUT);
    } else {
      safeSet(KEYS.ACTIVE_WORKOUT, state);
    }
  },

  // Progression Recommendations
  getProgressionRecommendations(): Record<string, ProgressionRecommendation> {
    return safeGet<Record<string, ProgressionRecommendation>>(KEYS.PROGRESSION_RECS, {});
  },
  saveProgressionRecommendations(recs: Record<string, ProgressionRecommendation>): void {
    safeSet(KEYS.PROGRESSION_RECS, recs);
  },

  // Export all application data as JSON
  exportDataJson(): string {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      userProfile: this.getUserProfile(),
      equipment: this.getEquipment(),
      settings: this.getSettings(),
      schedule: this.getSchedule(),
      strengthWorkouts: this.getStrengthWorkouts(),
      runningWorkouts: this.getRunningWorkouts(),
      workoutHistory: this.getWorkoutHistory(),
      runningHistory: this.getRunningHistory(),
      plyoHistory: this.getPlyoHistory(),
      progressionRecs: this.getProgressionRecommendations()
    };
    return JSON.stringify(data, null, 2);
  },

  // Import application data with validation
  importDataJson(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid data format: expected a JSON object' };
      }

      if (data.userProfile) this.saveUserProfile(data.userProfile);
      if (data.equipment) this.saveEquipment(data.equipment);
      if (data.settings) this.saveSettings(data.settings);
      if (data.schedule) this.saveSchedule(data.schedule);
      if (Array.isArray(data.strengthWorkouts)) this.saveStrengthWorkouts(data.strengthWorkouts);
      if (Array.isArray(data.runningWorkouts)) this.saveRunningWorkouts(data.runningWorkouts);
      if (Array.isArray(data.workoutHistory)) safeSet(KEYS.WORKOUT_HISTORY, data.workoutHistory);
      if (Array.isArray(data.runningHistory)) safeSet(KEYS.RUNNING_HISTORY, data.runningHistory);
      if (Array.isArray(data.plyoHistory)) safeSet(KEYS.PLYO_HISTORY, data.plyoHistory);
      if (data.progressionRecs) this.saveProgressionRecommendations(data.progressionRecs);

      return { success: true, message: 'Data imported successfully' };
    } catch (err: any) {
      return { success: false, message: `Failed to parse JSON: ${err?.message || 'Unknown error'}` };
    }
  },

  // Complete reset to initial setup
  resetAllData(): void {
    localStorage.clear();
    this.saveStrengthWorkouts(INITIAL_STRENGTH_WORKOUTS);
    this.saveRunningWorkouts(INITIAL_RUNNING_WORKOUTS);
    this.savePlyometricDrills(INITIAL_PLYOMETRIC_DRILLS);
    this.saveEquipment(INITIAL_EQUIPMENT);
    this.saveUserProfile(INITIAL_USER_PROFILE);
    this.saveSchedule(INITIAL_SCHEDULE);
    this.saveSettings(INITIAL_SETTINGS);
  }
};
