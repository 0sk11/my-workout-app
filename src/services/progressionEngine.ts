import { WorkoutSession, CompletedSet, WorkoutExercisePrescription } from '../types/workout';
import { EquipmentInventory } from '../types/equipment';
import { ProgressionRecommendation } from '../types/user';
import { EquipmentService } from './equipmentService';

export const ProgressionEngine = {
  /**
   * Evaluates performance in the latest workout session and determines
   * conservative double-progression suggestions for upcoming sessions.
   */
  evaluateWorkoutSession(
    session: WorkoutSession,
    prescriptions: WorkoutExercisePrescription[],
    equipment: EquipmentInventory,
    allHistory: WorkoutSession[]
  ): Record<string, ProgressionRecommendation> {
    const recommendations: Record<string, ProgressionRecommendation> = {};

    for (const log of session.exerciseLogs) {
      if (log.skipped || !log.completedSets || log.completedSets.length === 0) {
        continue;
      }

      const prescription = prescriptions.find(p => p.exerciseId === log.exerciseId);
      if (!prescription) continue;

      const completedSets = log.completedSets;
      const targetRepMax = prescription.targetRepRange.max;
      const targetRepMin = prescription.targetRepRange.min;
      const plannedSets = prescription.sets;

      // Check average RIR (Reps in Reserve)
      const validRirSets = completedSets.filter(s => s.rir !== undefined);
      const avgRir =
        validRirSets.length > 0
          ? validRirSets.reduce((sum, s) => sum + (s.rir || 0), 0) / validRirSets.length
          : 2; // default assumption

      // Check if user hit the top of the rep range on ALL prescribed sets
      const allSetsHitMaxReps =
        completedSets.length >= plannedSets &&
        completedSets.every(s => s.actualReps >= targetRepMax);

      // Check if user missed minimum reps
      const missedMinReps = completedSets.some(s => s.actualReps < targetRepMin);

      const currentLoad = completedSets[0].weightKg || 0;
      const currentReps = Math.round(
        completedSets.reduce((acc, s) => acc + s.actualReps, 0) / completedSets.length
      );

      // Special handling for band-assisted pull-ups
      if (log.exerciseId === 'band_assisted_pull_ups') {
        if (allSetsHitMaxReps && avgRir >= 2) {
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: 0,
            recommendedLoadKg: 0,
            currentReps,
            recommendedRepRange: { min: 3, max: 5 },
            progressionType: 'band_reduction',
            reason: `You completed all ${plannedSets} sets at ${targetRepMax} reps with controlled tempo and good reserve (${avgRir.toFixed(1)} RIR). Consider stepping down to a lighter assistance band (e.g. Medium instead of Heavy) to build unassisted pulling strength.`,
            calculatedAt: new Date().toISOString()
          };
        } else {
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: 0,
            recommendedLoadKg: 0,
            currentReps,
            recommendedRepRange: prescription.targetRepRange,
            progressionType: 'hold_load',
            reason: 'Consolidate controlled pulling form and slow 2-second negative lowering with current assistance band.',
            calculatedAt: new Date().toISOString()
          };
        }
        continue;
      }

      // Special handling for Push-ups (bodyweight)
      if (log.exerciseId === 'incline_push_ups' || log.exerciseId === 'floor_push_ups') {
        if (allSetsHitMaxReps && avgRir >= 2) {
          const nextRepTarget = Math.min(targetRepMax + 2, 12);
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: 0,
            recommendedLoadKg: 0,
            currentReps,
            recommendedRepRange: { min: targetRepMin + 1, max: nextRepTarget },
            progressionType: 'rep_increase',
            reason: `Great push-up stamina! You reached ${targetRepMax} reps comfortably on all sets. Target ${targetRepMin + 1}–${nextRepTarget} reps next session before lowering the surface incline.`,
            calculatedAt: new Date().toISOString()
          };
        } else if (missedMinReps || avgRir < 1) {
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: 0,
            recommendedLoadKg: 0,
            currentReps,
            recommendedRepRange: prescription.targetRepRange,
            progressionType: 'hold_load',
            reason: 'Keep current incline surface and target clean, controlled reps with ~2 reps in reserve. Avoid training to failure.',
            calculatedAt: new Date().toISOString()
          };
        }
        continue;
      }

      // Dumbbell / Weighted exercises (Double Progression)
      const isSingleDumbbell = log.exerciseId === 'goblet_squat';

      if (allSetsHitMaxReps && avgRir >= 2) {
        // Look up next available weight from equipment inventory
        const nextWeight = EquipmentService.getNextAvailableWeight(
          currentLoad,
          equipment,
          isSingleDumbbell
        );

        if (nextWeight !== null && nextWeight - currentLoad <= 2.5) {
          // Manageable increment available
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: currentLoad,
            recommendedLoadKg: nextWeight,
            currentReps,
            recommendedRepRange: { min: targetRepMin, max: targetRepMin + 2 },
            progressionType: 'weight_increase',
            reason: `Double Progression criteria met! You hit the top rep target (${targetRepMax} reps) across all sets with ~${avgRir.toFixed(0)} RIR. Recommended: Increase load to ${nextWeight} kg and reset to ${targetRepMin} reps.`,
            calculatedAt: new Date().toISOString()
          };
        } else {
          // Increment too large or at max equipment: suggest rep increase or pause tempo
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: currentLoad,
            recommendedLoadKg: currentLoad,
            currentReps,
            recommendedRepRange: { min: targetRepMin, max: targetRepMax + 2 },
            progressionType: 'rep_increase',
            reason: `You hit the top rep target with great control! Because the next available dumbbell increment is ${
              nextWeight ? `+${(nextWeight - currentLoad).toFixed(1)}kg (too big a jump)` : 'not currently in your plate inventory'
            }, progress by adding 1–2 reps or adding a 2-second pause at the bottom rather than forcing a heavy jump.`,
            calculatedAt: new Date().toISOString()
          };
        }
      } else if (missedMinReps) {
        // Check if user missed targets across consecutive sessions (fatigue check)
        const recentMisses = allHistory
          .slice(0, 2)
          .flatMap(s => s.exerciseLogs.filter(e => e.exerciseId === log.exerciseId))
          .filter(e => e.completedSets.some(cs => cs.actualReps < targetRepMin));

        if (recentMisses.length >= 2) {
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: currentLoad,
            recommendedLoadKg: Math.max(equipment.dumbbellHandleWeightKg, currentLoad - 2.0),
            currentReps,
            recommendedRepRange: prescription.targetRepRange,
            progressionType: 'deload',
            reason: 'You have been working hard and accumulated fatigue. Recommended: reduce load slightly or perform 1 set this week to allow recovery.',
            calculatedAt: new Date().toISOString()
          };
        } else {
          recommendations[log.exerciseId] = {
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            currentLoadKg: currentLoad,
            recommendedLoadKg: currentLoad,
            currentReps,
            recommendedRepRange: prescription.targetRepRange,
            progressionType: 'hold_load',
            reason: `Maintain current load (${currentLoad} kg). Aim for smooth, steady reps with generous rest periods.`,
            calculatedAt: new Date().toISOString()
          };
        }
      } else {
        // In the middle of rep range
        recommendations[log.exerciseId] = {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          currentLoadKg: currentLoad,
          recommendedLoadKg: currentLoad,
          currentReps,
          recommendedRepRange: prescription.targetRepRange,
          progressionType: 'rep_increase',
          reason: `On track! Maintain ${currentLoad} kg and aim to add 1 repetition per set next session with 2–3 reps in reserve.`,
          calculatedAt: new Date().toISOString()
        };
      }
    }

    return recommendations;
  }
};
