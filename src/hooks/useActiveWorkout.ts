import { useState, useEffect, useCallback } from 'react';
import {
  WorkoutTemplate,
  WorkoutSession,
  ActiveWorkoutState,
  CompletedSet,
  ReadinessCheck
} from '../types/workout';
import { EXERCISE_LIBRARY } from '../db/exerciseLibrary';
import { StorageService } from '../db/storage';
import { ProgressionEngine } from '../services/progressionEngine';
import { AudioService } from '../services/audioService';
import { VibrationService } from '../services/vibrationService';

export function useActiveWorkout() {
  const [activeState, setActiveState] = useState<ActiveWorkoutState | null>(() => {
    return StorageService.getActiveWorkout();
  });

  // Keep state synced to localStorage for 100% crash and refresh recovery
  useEffect(() => {
    StorageService.saveActiveWorkout(activeState);
  }, [activeState]);

  /**
   * Start a new workout session from a template
   */
  const startWorkout = useCallback((template: WorkoutTemplate, readiness?: ReadinessCheck) => {
    const session: WorkoutSession = {
      id: 'session_' + Date.now(),
      templateId: template.id,
      templateName: template.name,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      readinessCheck: readiness,
      exerciseLogs: template.exercises.map(prescription => {
        const def = EXERCISE_LIBRARY[prescription.exerciseId];
        return {
          exerciseId: prescription.exerciseId,
          exerciseName: def ? def.name : prescription.exerciseId,
          plannedSets: prescription.sets,
          completedSets: [],
          skipped: false,
          notes: prescription.notes
        };
      }),
      isCompleted: false
    };

    const newState: ActiveWorkoutState = {
      session,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      restTimer: null,
      transitionState: null,
      isPaused: false,
      pausedAtTimestamp: null,
      accumulatedPauseMs: 0
    };

    setActiveState(newState);
  }, []);

  /**
   * Log a completed set and automatically manage rest / transitions
   */
  const completeSet = useCallback(
    (
      exerciseIndex: number,
      setData: {
        actualReps: number;
        weightKg: number;
        rir?: number;
        notes?: string;
      },
      restDurationSeconds: number,
      autoStartRest: boolean = true
    ) => {
      setActiveState(prev => {
        if (!prev) return null;

        const currentLog = prev.session.exerciseLogs[exerciseIndex];
        if (!currentLog) return prev;

        const setNumber = currentLog.completedSets.length + 1;
        const newSet: CompletedSet = {
          setNumber,
          targetReps: setData.actualReps,
          actualReps: setData.actualReps,
          weightKg: setData.weightKg,
          rir: setData.rir,
          completedAt: new Date().toISOString(),
          notes: setData.notes
        };

        const updatedLogs = [...prev.session.exerciseLogs];
        updatedLogs[exerciseIndex] = {
          ...currentLog,
          completedSets: [...currentLog.completedSets, newSet]
        };

        const isLastSetForExercise = setNumber >= currentLog.plannedSets;
        const isLastExercise = exerciseIndex >= updatedLogs.length - 1;

        VibrationService.tap();

        // 1. More sets remain for current exercise -> Start rest timer
        if (!isLastSetForExercise) {
          return {
            ...prev,
            session: {
              ...prev.session,
              exerciseLogs: updatedLogs
            },
            currentSetIndex: setNumber,
            restTimer: autoStartRest
              ? {
                  isActive: true,
                  endTime: Date.now() + restDurationSeconds * 1000,
                  totalDurationSeconds: restDurationSeconds,
                  exerciseId: currentLog.exerciseId
                }
              : null
          };
        }

        // 2. All sets done for current exercise, but more exercises remain -> Transition
        if (!isLastExercise) {
          return {
            ...prev,
            session: {
              ...prev.session,
              exerciseLogs: updatedLogs
            },
            currentExerciseIndex: exerciseIndex,
            currentSetIndex: setNumber - 1,
            restTimer: null,
            transitionState: {
              isTransitioning: true,
              nextExerciseIndex: exerciseIndex + 1,
              countdownEndTime: Date.now() + 15000 // 15 sec transition preview
            }
          };
        }

        // 3. Last exercise and last set -> Ready for workout completion
        return {
          ...prev,
          session: {
            ...prev.session,
            exerciseLogs: updatedLogs
          },
          restTimer: null,
          transitionState: null
        };
      });
    },
    []
  );

  /**
   * Advance from transition screen to next exercise
   */
  const proceedToNextExercise = useCallback(() => {
    setActiveState(prev => {
      if (!prev || !prev.transitionState) return prev;
      return {
        ...prev,
        currentExerciseIndex: prev.transitionState.nextExerciseIndex,
        currentSetIndex: 0,
        transitionState: null,
        restTimer: null
      };
    });
  }, []);

  /**
   * Skip current exercise
   */
  const skipExercise = useCallback((exerciseIndex: number) => {
    setActiveState(prev => {
      if (!prev) return null;
      const updatedLogs = [...prev.session.exerciseLogs];
      updatedLogs[exerciseIndex] = {
        ...updatedLogs[exerciseIndex],
        skipped: true
      };

      const isLast = exerciseIndex >= updatedLogs.length - 1;

      return {
        ...prev,
        session: {
          ...prev.session,
          exerciseLogs: updatedLogs
        },
        currentExerciseIndex: isLast ? exerciseIndex : exerciseIndex + 1,
        currentSetIndex: 0,
        restTimer: null,
        transitionState: null
      };
    });
  }, []);

  /**
   * Substitute current exercise with another exercise ID
   */
  const substituteExercise = useCallback((exerciseIndex: number, newExerciseId: string) => {
    const newDef = EXERCISE_LIBRARY[newExerciseId];
    if (!newDef) return;

    setActiveState(prev => {
      if (!prev) return null;
      const updatedLogs = [...prev.session.exerciseLogs];
      const oldLog = updatedLogs[exerciseIndex];

      updatedLogs[exerciseIndex] = {
        exerciseId: newExerciseId,
        exerciseName: newDef.name,
        plannedSets: oldLog.plannedSets,
        completedSets: [],
        substitutionFor: oldLog.exerciseId,
        notes: `Substituted for ${oldLog.exerciseName}`
      };

      return {
        ...prev,
        session: {
          ...prev.session,
          exerciseLogs: updatedLogs
        },
        currentSetIndex: 0,
        restTimer: null
      };
    });
  }, []);

  /**
   * Dismiss active rest timer
   */
  const dismissRestTimer = useCallback(() => {
    setActiveState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        restTimer: null
      };
    });
  }, []);

  /**
   * Pause / resume entire workout
   */
  const togglePauseWorkout = useCallback(() => {
    setActiveState(prev => {
      if (!prev) return null;
      if (prev.isPaused) {
        // Resuming
        const pausedDuration = prev.pausedAtTimestamp
          ? Date.now() - prev.pausedAtTimestamp
          : 0;
        return {
          ...prev,
          isPaused: false,
          pausedAtTimestamp: null,
          accumulatedPauseMs: prev.accumulatedPauseMs + pausedDuration
        };
      } else {
        // Pausing
        return {
          ...prev,
          isPaused: true,
          pausedAtTimestamp: Date.now()
        };
      }
    });
  }, []);

  /**
   * Complete and save workout to history
   */
  const finishWorkout = useCallback(
    (rpe: number = 7, notes: string = '') => {
      if (!activeState) return;

      const startedMs = new Date(activeState.session.startedAt).getTime();
      const endedMs = Date.now();
      const totalElapsedSec = Math.max(
        60,
        Math.round((endedMs - startedMs - activeState.accumulatedPauseMs) / 1000)
      );

      // Check for PRs (Personal Records)
      const prs: string[] = [];
      const history = StorageService.getWorkoutHistory();

      activeState.session.exerciseLogs.forEach(log => {
        if (log.completedSets.length > 0) {
          const maxWeight = Math.max(...log.completedSets.map(s => s.weightKg));
          const maxReps = Math.max(...log.completedSets.map(s => s.actualReps));

          // Find past logs for this exercise
          const pastMaxWeight = Math.max(
            0,
            ...history
              .flatMap(h => h.exerciseLogs)
              .filter(e => e.exerciseId === log.exerciseId)
              .flatMap(e => e.completedSets)
              .map(s => s.weightKg)
          );

          if (maxWeight > pastMaxWeight && maxWeight > 0) {
            prs.push(`${log.exerciseName}: New Weight PR (${maxWeight} kg)`);
          } else if (pastMaxWeight === 0 && maxWeight > 0) {
            prs.push(`${log.exerciseName}: First logged lift (${maxWeight} kg)`);
          }
        }
      });

      const finishedSession: WorkoutSession = {
        ...activeState.session,
        durationSeconds: totalElapsedSec,
        completedAt: new Date().toISOString(),
        isCompleted: true,
        rpe,
        overallNotes: notes,
        prsAchieved: prs
      };

      // Save session
      StorageService.saveWorkoutSession(finishedSession);

      // Run double-progression engine to generate next targets!
      const templates = StorageService.getStrengthWorkouts();
      const currentTemplate = templates.find(t => t.id === finishedSession.templateId);
      if (currentTemplate) {
        const equipment = StorageService.getEquipment();
        const recs = ProgressionEngine.evaluateWorkoutSession(
          finishedSession,
          currentTemplate.exercises,
          equipment,
          history
        );
        const existingRecs = StorageService.getProgressionRecommendations();
        StorageService.saveProgressionRecommendations({ ...existingRecs, ...recs });
      }

      AudioService.playWorkoutCompleteChime();
      VibrationService.workoutFinished();

      // Clear active state
      setActiveState(null);
      StorageService.saveActiveWorkout(null);
    },
    [activeState]
  );

  /**
   * Cancel and discard active workout session
   */
  const discardWorkout = useCallback(() => {
    setActiveState(null);
    StorageService.saveActiveWorkout(null);
  }, []);

  return {
    activeState,
    startWorkout,
    completeSet,
    proceedToNextExercise,
    skipExercise,
    substituteExercise,
    dismissRestTimer,
    togglePauseWorkout,
    finishWorkout,
    discardWorkout
  };
}
