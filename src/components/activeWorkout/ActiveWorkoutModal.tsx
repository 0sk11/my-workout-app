import React, { useState, useEffect } from 'react';
import {
  ActiveWorkoutState,
  WorkoutTemplate,
  WorkoutExercisePrescription
} from '../../types/workout';
import { EXERCISE_LIBRARY } from '../../db/exerciseLibrary';
import { StorageService } from '../../db/storage';
import { EquipmentService } from '../../services/equipmentService';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import { ExerciseIllustration } from '../common/ExerciseIllustration';
import {
  Check,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  X,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Award,
  AlertTriangle
} from 'lucide-react';

interface Props {
  activeState: ActiveWorkoutState;
  onCompleteSet: (
    exerciseIndex: number,
    setData: { actualReps: number; weightKg: number; rir?: number; notes?: string },
    restDurationSeconds: number,
    autoStartRest?: boolean
  ) => void;
  onProceedToNextExercise: () => void;
  onSkipExercise: (exerciseIndex: number) => void;
  onSubstituteExercise: (exerciseIndex: number, newExerciseId: string) => void;
  onDismissRestTimer: () => void;
  onTogglePauseWorkout: () => void;
  onFinishWorkout: (rpe?: number, notes?: string) => void;
  onDiscardWorkout: () => void;
}

export const ActiveWorkoutModal: React.FC<Props> = ({
  activeState,
  onCompleteSet,
  onProceedToNextExercise,
  onSkipExercise,
  onSubstituteExercise,
  onDismissRestTimer,
  onTogglePauseWorkout,
  onFinishWorkout,
  onDiscardWorkout
}) => {
  const { session, currentExerciseIndex, currentSetIndex, restTimer, transitionState, isPaused } =
    activeState;

  const currentLog = session.exerciseLogs[currentExerciseIndex];
  const exerciseDef = currentLog ? EXERCISE_LIBRARY[currentLog.exerciseId] : null;

  // Retrieve current workout template prescription for starting load & rest
  const template = StorageService.getStrengthWorkouts().find(t => t.id === session.templateId);
  const prescription: WorkoutExercisePrescription | undefined = template?.exercises[currentExerciseIndex];
  const equipment = StorageService.getEquipment();
  const settings = StorageService.getSettings();

  // Find last session's logged stats for this exercise
  const [lastSessionStats, setLastSessionStats] = useState<string | null>(null);

  useEffect(() => {
    if (!currentLog) return;
    const history = StorageService.getWorkoutHistory();
    const pastSessions = history
      .filter(s => s.id !== session.id)
      .flatMap(s => s.exerciseLogs)
      .filter(e => e.exerciseId === currentLog.exerciseId && e.completedSets.length > 0);

    if (pastSessions.length > 0) {
      const last = pastSessions[0];
      const setsDesc = last.completedSets
        .map(s => `${s.actualReps}r${s.weightKg > 0 ? `@${s.weightKg}kg` : ''}`)
        .join(', ');
      setLastSessionStats(`Last: ${setsDesc}`);
    } else {
      setLastSessionStats(null);
    }
  }, [currentLog, session.id]);

  // Set Log Input State
  const defaultTargetReps = prescription?.targetRepRange.max || 10;
  const defaultWeight = prescription?.startingWeightKg || 0;

  const [inputReps, setInputReps] = useState<number>(defaultTargetReps);
  const [inputWeight, setInputWeight] = useState<number>(defaultWeight);
  const [inputRir, setInputRir] = useState<number>(2); // 2 Reps in Reserve default (safe, non-failure)
  const [inputNotes, setInputNotes] = useState<string>('');
  const [showPlateHelper, setShowPlateHelper] = useState<boolean>(false);
  const [showSubstitutions, setShowSubstitutions] = useState<boolean>(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);
  const [finishRpe, setFinishRpe] = useState<number>(7);
  const [finishNotes, setFinishNotes] = useState<string>('');

  // Update input values when moving to another exercise or set
  useEffect(() => {
    if (prescription) {
      setInputReps(prescription.targetRepRange.min);
      setInputWeight(prescription.startingWeightKg || 0);
      setInputNotes('');
    }
  }, [currentExerciseIndex, prescription]);

  // Hook for Rest Timer
  const timer = useWorkoutTimer({
    soundEnabled: settings.soundEnabled,
    vibrationEnabled: settings.vibrationEnabled,
    onComplete: () => {
      onDismissRestTimer();
    }
  });

  // Sync activeState.restTimer to useWorkoutTimer
  useEffect(() => {
    if (restTimer && restTimer.isActive && restTimer.endTime) {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((restTimer.endTime - now) / 1000));
      if (remaining > 0 && !timer.isRunning) {
        timer.startTimer(remaining);
      }
    } else if (!restTimer && timer.isRunning) {
      timer.stopTimer();
    }
  }, [restTimer, timer]);

  // Format Elapsed Workout Time
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  useEffect(() => {
    const startMs = new Date(session.startedAt).getTime();
    const interval = setInterval(() => {
      if (!isPaused) {
        const now = Date.now();
        setElapsedSec(Math.max(0, Math.floor((now - startMs - activeState.accumulatedPauseMs) / 1000)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startedAt, isPaused, activeState.accumulatedPauseMs]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentPlannedSets = currentLog?.plannedSets || prescription?.sets || 2;
  const currentSetDisplay = (currentLog?.completedSets.length || 0) + 1;
  const isTimeBased = exerciseDef?.isTimeBased || false;

  // Handler to log set
  const handleCompleteCurrentSet = () => {
    const restSec = prescription?.restSeconds || exerciseDef?.defaultRestSeconds || 90;
    onCompleteSet(
      currentExerciseIndex,
      {
        actualReps: inputReps,
        weightKg: inputWeight,
        rir: inputRir,
        notes: inputNotes
      },
      restSec,
      settings.autoStartRestTimer
    );
  };

  // Plate breakdown for current dumbbell load
  const isSingleDumbbell = currentLog?.exerciseId === 'goblet_squat';
  const plateBreakdown = EquipmentService.getPlateBreakdown(inputWeight, equipment, isSingleDumbbell);

  // Check if all exercises are completed
  const allExercisesCompleted = session.exerciseLogs.every(
    log => log.skipped || log.completedSets.length >= log.plannedSets
  );

  return (
    <div className="active-workout-view">
      {/* Precision Top Control Bar */}
      <div
        style={{
          height: '56px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-4)',
          position: 'sticky',
          top: 0,
          zIndex: 60
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onTogglePauseWorkout}
            className={`btn btn-sm ${isPaused ? 'btn-primary' : 'btn-outline'}`}
            style={{ width: '36px', height: '36px', padding: 0 }}
            title={isPaused ? 'Resume Workout' : 'Pause Workout'}
          >
            {isPaused ? <Play size={15} fill="currentColor" /> : <Pause size={15} />}
          </button>
          <div>
            <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700 }}>
              {formatTime(elapsedSec)}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              {isPaused ? 'PAUSED' : 'ELAPSED'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
            Exercise {currentExerciseIndex + 1} of {session.exerciseLogs.length}
          </div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '3px', justifyContent: 'center' }}>
            {session.exerciseLogs.map((log, idx) => {
              const isDone = log.completedSets.length >= log.plannedSets;
              const isCurrent = idx === currentExerciseIndex;
              return (
                <div
                  key={idx}
                  style={{
                    width: '16px',
                    height: '3px',
                    borderRadius: '1px',
                    background: isCurrent
                      ? 'var(--accent)'
                      : isDone
                      ? 'var(--color-success)'
                      : log.skipped
                      ? 'var(--text-tertiary)'
                      : 'var(--border-strong)'
                  }}
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setShowFinishConfirm(true)}
          className="btn btn-sm btn-outline"
          style={{ height: '32px', fontSize: '12px', padding: '0 8px' }}
        >
          Finish
        </button>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
        {/* Paused Banner */}
        {isPaused && (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              background: 'var(--color-timer-muted)',
              border: '1px solid var(--color-timer)',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--color-timer)'
            }}
          >
            Workout Paused — Tap play button in header to resume
          </div>
        )}

        {/* Transition Preview Screen */}
        {transitionState && transitionState.isTransitioning ? (
          <div className="swiss-card elevated" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <span className="swiss-badge success" style={{ marginBottom: '12px' }}>
              Exercise Completed!
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
              Next: {session.exerciseLogs[transitionState.nextExerciseIndex]?.exerciseName}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Take a moment to prepare your equipment or plates.
            </div>

            <button onClick={onProceedToNextExercise} className="btn btn-primary btn-full btn-lg">
              Start Next Exercise <ChevronRight size={18} />
            </button>
          </div>
        ) : allExercisesCompleted ? (
          /* All Exercises Completed Screen */
          <div className="swiss-card elevated" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--color-success-muted)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Trophy size={28} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Workout Complete!
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              All prescribed exercises logged. Ready to save session and review progression suggestions.
            </p>

            <button
              onClick={() => setShowFinishConfirm(true)}
              className="btn btn-primary btn-full btn-lg"
            >
              Review & Save Workout
            </button>
          </div>
        ) : (
          /* Active Exercise Screen */
          <>
            {/* Header of Exercise */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="swiss-badge accent">
                  Set {Math.min(currentSetDisplay, currentPlannedSets)} of {currentPlannedSets}
                </span>
                {prescription?.isOptional && (
                  <span className="swiss-badge" style={{ color: 'var(--color-timer)' }}>
                    Optional Exercise
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>
                {exerciseDef ? exerciseDef.name : currentLog?.exerciseName}
              </h1>

              {/* Target Prescription & Last Session */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <span className="swiss-badge">
                  Target: {prescription?.sets || 2} × {prescription?.targetRepRange.min}–{prescription?.targetRepRange.max} reps
                </span>
                {lastSessionStats && (
                  <span className="swiss-badge" style={{ borderColor: 'var(--border-strong)' }}>
                    {lastSessionStats}
                  </span>
                )}
              </div>
            </div>

            {/* Swiss SVG Exercise Line Illustration */}
            <div style={{ marginBottom: '16px' }}>
              <ExerciseIllustration
                illustrationKey={exerciseDef?.illustrationSvgKey || 'generic'}
                name={exerciseDef?.name || 'Exercise'}
              />
            </div>

            {/* Concise Technique Cues */}
            {exerciseDef && exerciseDef.techniqueCues.length > 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  lineHeight: 1.45
                }}
              >
                <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  Technique Check
                </div>
                <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  {exerciseDef.techniqueCues.slice(0, 3).map((cue, cIdx) => (
                    <li key={cIdx} style={{ marginBottom: '2px' }}>{cue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reps & Weight Input Controls */}
            <div className="swiss-card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {/* Reps Input */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isTimeBased ? 'Duration (Sec)' : 'Completed Reps'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setInputReps(r => Math.max(1, r - 1))}
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '44px', padding: 0 }}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={inputReps}
                      onChange={e => setInputReps(Number(e.target.value))}
                      className="input-field font-mono"
                      style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700 }}
                    />
                    <button
                      onClick={() => setInputReps(r => r + 1)}
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '44px', padding: 0 }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Weight Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      Weight (Kg)
                    </label>
                    {inputWeight > 0 && (
                      <button
                        onClick={() => setShowPlateHelper(!showPlateHelper)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
                      >
                        <HelpCircle size={12} /> Plates
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setInputWeight(w => Math.max(0, Number((w - 0.5).toFixed(1))))}
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '44px', padding: 0 }}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      value={inputWeight}
                      onChange={e => setInputWeight(Number(e.target.value))}
                      className="input-field font-mono"
                      style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700 }}
                    />
                    <button
                      onClick={() => setInputWeight(w => Number((w + 0.5).toFixed(1)))}
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '44px', padding: 0 }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Plate Breakdown Helper */}
              {(showPlateHelper || inputWeight > 0) && (
                <div
                  style={{
                    padding: '8px 10px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '12px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>Plates Per Dumbbell: </strong>
                  {plateBreakdown}
                </div>
              )}

              {/* RIR (Reps in Reserve) Selector */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Perceived Reserve (Reps Left Before Failure)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { rir: 3, label: '3+ RIR', desc: 'Comfortable' },
                    { rir: 2, label: '2 RIR', desc: 'Target' },
                    { rir: 1, label: '1 RIR', desc: 'Challenging' },
                    { rir: 0, label: '0 RIR', desc: 'Near Failure' }
                  ].map(opt => (
                    <button
                      key={opt.rir}
                      type="button"
                      onClick={() => setInputRir(opt.rir)}
                      className={`btn btn-sm ${inputRir === opt.rir ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flexDirection: 'column', height: '42px', padding: '2px' }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{opt.label}</span>
                      <span style={{ fontSize: '9px', opacity: 0.8 }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Action Button: COMPLETE SET */}
            <button
              onClick={handleCompleteCurrentSet}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginBottom: '12px', fontSize: '17px' }}
            >
              <Check size={20} strokeWidth={2.5} />
              Complete Set {Math.min(currentSetDisplay, currentPlannedSets)}
            </button>

            {/* In-Workout Actions: Skip / Substitute */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => setShowSubstitutions(true)}
                className="btn btn-outline btn-sm"
              >
                Substitute Exercise
              </button>
              <button
                onClick={() => onSkipExercise(currentExerciseIndex)}
                className="btn btn-outline btn-sm"
              >
                Skip Exercise
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating Rest Timer Overlay (When Rest Timer is Active) */}
      {restTimer && restTimer.isActive && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '480px',
            margin: '0 auto',
            background: 'var(--bg-surface)',
            borderTop: '2px solid var(--color-timer)',
            padding: '16px',
            boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.4)',
            zIndex: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="swiss-badge timer" style={{ marginBottom: '2px' }}>
                Rest Interval
              </span>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Next: Set {(currentLog?.completedSets.length || 0) + 1} of {currentPlannedSets}
              </div>
            </div>
            <div className="timer-digits" style={{ fontSize: '38px' }}>
              {formatTime(timer.remainingSeconds)}
            </div>
          </div>

          {/* Timer Controls (+15s, +30s, Pause/Resume, Skip) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '8px' }}>
            <button
              onClick={timer.isPaused ? timer.resumeTimer : timer.pauseTimer}
              className="btn btn-secondary btn-sm"
              style={{ width: '40px', padding: 0 }}
            >
              {timer.isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              onClick={() => timer.extendTimer(15)}
              className="btn btn-secondary btn-sm"
            >
              +15s
            </button>
            <button
              onClick={() => timer.extendTimer(30)}
              className="btn btn-secondary btn-sm"
            >
              +30s
            </button>
            <button
              onClick={() => {
                timer.stopTimer();
                onDismissRestTimer();
              }}
              className="btn btn-primary btn-sm"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Exercise Substitutions Modal */}
      {showSubstitutions && exerciseDef && (
        <div className="modal-overlay" onClick={() => setShowSubstitutions(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Substitute Movement</h3>
              <button onClick={() => setShowSubstitutions(false)} className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0 }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Select a safe, equipment-compatible alternative for <strong>{exerciseDef.name}</strong>:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {exerciseDef.substitutions.map(subId => {
                const subDef = EXERCISE_LIBRARY[subId];
                if (!subDef) return null;
                return (
                  <button
                    key={subId}
                    onClick={() => {
                      onSubstituteExercise(currentExerciseIndex, subId);
                      setShowSubstitutions(false);
                    }}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'space-between', height: 'auto', padding: '12px' }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{subDef.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {subDef.equipment.join(', ')} • {subDef.primaryMuscles.join(', ')}
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Finish Workout Summary & Rating Modal */}
      {showFinishConfirm && (
        <div className="modal-overlay" onClick={() => setShowFinishConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Session Summary</h3>
              <button onClick={() => setShowFinishConfirm(false)} className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0 }}>
                <X size={16} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Time</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700 }}>{formatTime(elapsedSec)}</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Sets</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700 }}>
                  {session.exerciseLogs.reduce((acc, l) => acc + l.completedSets.length, 0)}
                </div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Reps</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700 }}>
                  {session.exerciseLogs.flatMap(l => l.completedSets).reduce((acc, s) => acc + s.actualReps, 0)}
                </div>
              </div>
            </div>

            {/* RPE Rating (1-10) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Overall Session Effort (RPE: {finishRpe} / 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={finishRpe}
                onChange={e => setFinishRpe(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                <span>1 (Very Light)</span>
                <span>5 (Moderate)</span>
                <span>8 (Vigorous)</span>
                <span>10 (Maximum)</span>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Session Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="How did shoulders/arms feel? Any discomfort?"
                value={finishNotes}
                onChange={e => setFinishNotes(e.target.value)}
                className="input-field"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onFinishWorkout(finishRpe, finishNotes)}
                className="btn btn-primary btn-full btn-lg"
              >
                Save & Finish Session
              </button>
              <button
                onClick={onDiscardWorkout}
                className="btn btn-outline btn-full"
                style={{ color: 'var(--color-danger)' }}
              >
                Discard Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
