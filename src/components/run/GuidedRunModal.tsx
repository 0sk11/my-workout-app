import React, { useState, useEffect } from 'react';
import { RunningWorkoutTemplate, RunTimerPhase, RunningSessionLog } from '../../types/running';
import { StorageService } from '../../db/storage';
import { AudioService } from '../../services/audioService';
import { VibrationService } from '../../services/vibrationService';
import {
  Play,
  Pause,
  SkipForward,
  X,
  Activity,
  CheckCircle2,
  Clock,
  Heart,
  Flame,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface Props {
  template: RunningWorkoutTemplate;
  onFinishRun: (log: RunningSessionLog) => void;
  onClose: () => void;
}

export const GuidedRunModal: React.FC<Props> = ({ template, onFinishRun, onClose }) => {
  const [phase, setPhase] = useState<RunTimerPhase>('warmup');
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [currentWarmupIndex, setCurrentWarmupIndex] = useState<number>(0);
  const [currentCooldownIndex, setCurrentCooldownIndex] = useState<number>(0);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [totalElapsedSec, setTotalElapsedSec] = useState<number>(0);
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState<number>(
    template.warmupRoutine[0]?.durationSeconds || 120
  );

  // Post Run Log Form State
  const [showLogForm, setShowLogForm] = useState<boolean>(false);
  const [distanceKm, setDistanceKm] = useState<number>(5.0);
  const [rpe, setRpe] = useState<number>(6);
  const [avgPace, setAvgPace] = useState<string>('5:45');
  const [avgHr, setAvgHr] = useState<number>(145);
  const [notes, setNotes] = useState<string>('');

  const settings = StorageService.getSettings();

  // Run Timer tick
  useEffect(() => {
    if (!isRunning || showLogForm) return;

    const interval = setInterval(() => {
      setTotalElapsedSec(prev => prev + 1);

      setPhaseSecondsRemaining(prev => {
        if (prev <= 1) {
          // Transition within phase or to next phase!
          handleAutoAdvance();
          return 0;
        }
        if (prev <= 4 && settings.soundEnabled) {
          AudioService.playCountdownTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, showLogForm, phase, currentBlockIndex, currentWarmupIndex, currentCooldownIndex]);

  const handleAutoAdvance = () => {
    if (settings.soundEnabled) AudioService.playRestCompleteChime();
    if (settings.vibrationEnabled) VibrationService.restFinished();

    if (phase === 'warmup') {
      const nextW = currentWarmupIndex + 1;
      if (nextW < template.warmupRoutine.length) {
        setCurrentWarmupIndex(nextW);
        setPhaseSecondsRemaining(template.warmupRoutine[nextW].durationSeconds || 60);
      } else {
        // Move to main blocks!
        setPhase('main');
        setCurrentBlockIndex(0);
        setPhaseSecondsRemaining(template.mainBlocks[0]?.durationSeconds || 1200);
      }
    } else if (phase === 'main' || phase === 'interval_work' || phase === 'interval_rest') {
      const nextB = currentBlockIndex + 1;
      if (nextB < template.mainBlocks.length) {
        setCurrentBlockIndex(nextB);
        const block = template.mainBlocks[nextB];
        setPhaseSecondsRemaining(block.durationSeconds);
      } else {
        // Move to cooldown
        setPhase('cooldown');
        setCurrentCooldownIndex(0);
        setPhaseSecondsRemaining(template.cooldownRoutine[0]?.durationSeconds || 30);
      }
    } else if (phase === 'cooldown') {
      const nextC = currentCooldownIndex + 1;
      if (nextC < template.cooldownRoutine.length) {
        setCurrentCooldownIndex(nextC);
        setPhaseSecondsRemaining(template.cooldownRoutine[nextC].durationSeconds);
      } else {
        // Run completed!
        setIsRunning(false);
        setShowLogForm(true);
        if (settings.soundEnabled) AudioService.playWorkoutCompleteChime();
      }
    }
  };

  const handleManualSkipPhase = () => {
    handleAutoAdvance();
  };

  const formatMinSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentMainBlock = template.mainBlocks[currentBlockIndex];
  const currentWarmupItem = template.warmupRoutine[currentWarmupIndex];
  const currentCooldownItem = template.cooldownRoutine[currentCooldownIndex];

  const handleSaveCompletedRun = () => {
    const log: RunningSessionLog = {
      id: 'run_' + Date.now(),
      templateId: template.id,
      runType: template.runType,
      title: template.title,
      date: new Date().toISOString(),
      durationSeconds: totalElapsedSec,
      distanceKm: Number(distanceKm),
      averagePaceMinPerKm: avgPace,
      averageHeartRateBpm: avgHr > 0 ? Number(avgHr) : undefined,
      rpe: Number(rpe),
      warmupCompleted: true,
      cooldownCompleted: true,
      notes
    };

    StorageService.saveRunningSession(log);
    onFinishRun(log);
  };

  return (
    <div className="active-workout-view">
      {/* Top Header */}
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
          <Activity size={18} color="var(--color-run)" />
          <span style={{ fontSize: '14px', fontWeight: 800 }}>{template.title}</span>
        </div>

        <button
          onClick={() => {
            setIsRunning(false);
            setShowLogForm(true);
          }}
          className="btn btn-sm btn-outline"
          style={{ height: '32px', fontSize: '12px', padding: '0 8px' }}
        >
          End Run
        </button>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
        {!showLogForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phase Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`swiss-badge ${phase === 'main' ? 'run' : 'timer'}`} style={{ fontSize: '12px' }}>
                Phase: {phase.toUpperCase()}
              </span>
              <span className="font-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Total: {formatMinSec(totalElapsedSec)}
              </span>
            </div>

            {/* Huge Phase Timer Display */}
            <div
              className="swiss-card elevated"
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                borderColor: phase === 'main' ? 'var(--color-run)' : 'var(--border-strong)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                {phase === 'warmup'
                  ? `Dynamic Warm-up (${currentWarmupIndex + 1}/${template.warmupRoutine.length})`
                  : phase === 'cooldown'
                  ? `Cool-down Routine (${currentCooldownIndex + 1}/${template.cooldownRoutine.length})`
                  : currentMainBlock?.name || 'Main Workout'}
              </div>

              <div
                className="font-mono"
                style={{
                  fontSize: '64px',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: phase === 'main' ? 'var(--color-run)' : 'var(--color-timer)',
                  letterSpacing: '-0.04em',
                  marginBottom: '12px'
                }}
              >
                {formatMinSec(phaseSecondsRemaining)}
              </div>

              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                {phase === 'warmup'
                  ? currentWarmupItem?.name
                  : phase === 'cooldown'
                  ? currentCooldownItem?.name
                  : currentMainBlock?.targetPaceDescription || 'Steady Zone 2 Pace'}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto' }}>
                {phase === 'warmup'
                  ? currentWarmupItem?.cues
                  : phase === 'cooldown'
                  ? currentCooldownItem?.cues
                  : template.perceivedEffortTarget}
              </p>
            </div>

            {/* Next Step Preview */}
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                Up Next:
              </div>
              <div style={{ fontWeight: 600 }}>
                {phase === 'warmup' && template.warmupRoutine[currentWarmupIndex + 1]
                  ? template.warmupRoutine[currentWarmupIndex + 1].name
                  : phase === 'warmup'
                  ? `Main Run: ${template.mainBlocks[0]?.name}`
                  : phase === 'main' && template.mainBlocks[currentBlockIndex + 1]
                  ? template.mainBlocks[currentBlockIndex + 1].name
                  : phase === 'main'
                  ? `Cool-down: ${template.cooldownRoutine[0]?.name}`
                  : 'Session Finish'}
              </div>
            </div>

            {/* Timer Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={handleManualSkipPhase}
                className="btn btn-outline"
              >
                <SkipForward size={16} /> Next Drill / Block
              </button>
            </div>
          </div>
        ) : (
          /* Post Run Completion Log Form */
          <div className="swiss-card elevated">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Run Completed!
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Record your workout data below to update your weekly running mileage and durability stats.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distanceKm}
                  onChange={e => setDistanceKm(Number(e.target.value))}
                  className="input-field font-mono"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Total Time
                </label>
                <div
                  className="input-field font-mono"
                  style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}
                >
                  {formatMinSec(totalElapsedSec)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Avg Pace (min/km)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5:45"
                  value={avgPace}
                  onChange={e => setAvgPace(e.target.value)}
                  className="input-field font-mono"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Avg Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={avgHr || ''}
                  onChange={e => setAvgHr(Number(e.target.value))}
                  className="input-field font-mono"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>

            {/* RPE Rating */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Perceived Effort (RPE: {rpe} / 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rpe}
                onChange={e => setRpe(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-run)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                <span>1 (Easy Walk)</span>
                <span>4 (Zone 2)</span>
                <span>7 (Threshold)</span>
                <span>10 (All-out)</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Notes & Tendon Sensations
              </label>
              <input
                type="text"
                placeholder="How did ankles and calves feel?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input-field"
                style={{ fontSize: '13px' }}
              />
            </div>

            <button onClick={handleSaveCompletedRun} className="btn btn-run btn-full btn-lg">
              Save Run to History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
