import React, { useState } from 'react';
import { WorkoutTemplate, ReadinessCheck } from '../../types/workout';
import { ScheduledDay, ScheduleConflictWarning } from '../../types/user';
import { StorageService } from '../../db/storage';
import { ScheduleChecker } from '../../services/scheduleChecker';
import { ReadinessModal } from './ReadinessModal';
import {
  Calendar,
  Play,
  Dumbbell,
  Activity,
  Flame,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';

interface Props {
  onStartStrength: (template: WorkoutTemplate, readiness?: ReadinessCheck) => void;
  onOpenRun: (runId: string) => void;
  hasActiveWorkout: boolean;
  onResumeWorkout: () => void;
}

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const TodayView: React.FC<Props> = ({
  onStartStrength,
  onOpenRun,
  hasActiveWorkout,
  onResumeWorkout
}) => {
  const schedule = StorageService.getSchedule();
  const strengthTemplates = StorageService.getStrengthWorkouts();
  const history = StorageService.getWorkoutHistory();
  const runHistory = StorageService.getRunningHistory();
  const progressionRecs = StorageService.getProgressionRecommendations();

  // Find today's scheduled day
  const todayIndex = new Date().getDay(); // 0 is Sunday
  const todayKey = DAY_NAMES[todayIndex];
  const todaySchedule = schedule.find(s => s.day === todayKey) || schedule[0];

  // Identify primary template for today if it is a strength workout
  const isStrengthToday =
    todaySchedule.primaryActivity === 'upper_a' ||
    todaySchedule.primaryActivity === 'lower' ||
    todaySchedule.primaryActivity === 'upper_b';

  const scheduledTemplate = strengthTemplates.find(
    t => t.category === todaySchedule.primaryActivity
  );

  // Fallback to Upper A if rest or custom
  const selectedTemplate = scheduledTemplate || strengthTemplates[0];

  const [showReadinessModal, setShowReadinessModal] = useState<boolean>(false);

  // Check schedule conflicts
  const conflicts: ScheduleConflictWarning[] = ScheduleChecker.checkConflicts(schedule);

  // Calculate weekly consistency (this calendar week)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyStrengthCount = history.filter(h => new Date(h.startedAt) >= oneWeekAgo).length;
  const weeklyRunCount = runHistory.filter(r => new Date(r.date) >= oneWeekAgo).length;

  const recList = Object.values(progressionRecs);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Active Workout Resume Banner */}
      {hasActiveWorkout && (
        <div
          className="swiss-card"
          style={{
            background: 'var(--accent-muted)',
            borderColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px'
          }}
        >
          <div>
            <span className="swiss-badge accent" style={{ marginBottom: '4px' }}>
              In Progress
            </span>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Workout in Progress</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Resume your unfinished session
            </div>
          </div>
          <button onClick={onResumeWorkout} className="btn btn-primary btn-sm">
            <Play size={14} fill="currentColor" /> Resume
          </button>
        </div>
      )}

      {/* Today's Focus Card */}
      <div className="swiss-card elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="swiss-badge accent">
            {todaySchedule.dayLabel} • Scheduled Session
          </span>
          <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {isStrengthToday && selectedTemplate ? (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              {selectedTemplate.name}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {selectedTemplate.targetFocus}
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', fontSize: '12px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Duration: </span>
                <strong className="font-mono">~{selectedTemplate.estimatedDurationMinutes} min</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Exercises: </span>
                <strong className="font-mono">{selectedTemplate.exercises.length} movements</strong>
              </div>
            </div>

            <button
              onClick={() => setShowReadinessModal(true)}
              className="btn btn-primary btn-full btn-lg"
            >
              <Play size={18} fill="currentColor" />
              Start Workout
            </button>
          </div>
        ) : todaySchedule.primaryActivity === 'rest' ? (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Scheduled Rest & Recovery
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Recovery is where muscle adapts and running tendons rebuild. Focus on light walking, hydration, and mobility.
            </p>
            <button
              onClick={() => setShowReadinessModal(true)}
              className="btn btn-outline btn-full"
            >
              Train Anyway (Start Upper A)
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px', textTransform: 'capitalize' }}>
              {todaySchedule.primaryActivity.replace('_', ' ')}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Scheduled running session. Keep cadence light and aerobic effort in Zone 2.
            </p>
            <button
              onClick={() => onOpenRun(todaySchedule.primaryActivity)}
              className="btn btn-run btn-full btn-lg"
            >
              <Activity size={18} />
              Open Run Guidance
            </button>
          </div>
        )}
      </div>

      {/* Progression Recommendations (Double Progression Output) */}
      {recList.length > 0 && (
        <div className="swiss-card" style={{ borderColor: 'var(--border-strong)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={16} color="var(--accent)" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Progression Engine Insights
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recList.slice(0, 2).map((rec, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '2px', color: 'var(--accent)' }}>
                  {rec.exerciseName}
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {rec.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Conflict Warning (if lower strength & long run collide) */}
      {conflicts.map((c, i) => (
        <div
          key={i}
          style={{
            padding: '12px 14px',
            borderRadius: '6px',
            background: 'var(--color-timer-muted)',
            border: '1px solid var(--color-timer)',
            fontSize: '12px',
            lineHeight: 1.45
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-timer)', marginBottom: '4px' }}>
            <AlertTriangle size={15} />
            Schedule Conflict Alert
          </div>
          <div style={{ marginBottom: '4px' }}>{c.message}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{c.suggestion}</div>
        </div>
      ))}

      {/* Weekly Schedule Overview */}
      <div className="swiss-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4>7-Day Schedule</h4>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Editable in Settings</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {schedule.map((item, idx) => {
            const isToday = item.day === todayKey;
            const isStrength = item.primaryActivity.includes('upper') || item.primaryActivity === 'lower';
            const isRun = item.primaryActivity.includes('run') || item.primaryActivity === 'intervals';

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: isToday ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: isToday ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className="font-mono"
                    style={{
                      width: '32px',
                      fontSize: '12px',
                      fontWeight: isToday ? 800 : 500,
                      color: isToday ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {item.day.slice(0, 3).toUpperCase()}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: isToday ? 700 : 500 }}>
                    {item.primaryActivity === 'upper_a'
                      ? 'Upper A (Foundational)'
                      : item.primaryActivity === 'lower'
                      ? 'Lower (Running Strength)'
                      : item.primaryActivity === 'upper_b'
                      ? 'Upper B (Balanced)'
                      : item.primaryActivity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <span
                  className={`swiss-badge ${isStrength ? 'accent' : isRun ? 'run' : ''}`}
                  style={{ fontSize: '10px' }}
                >
                  {isStrength ? 'Strength' : isRun ? 'Run' : 'Rest'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Session Readiness Modal */}
      {showReadinessModal && selectedTemplate && (
        <ReadinessModal
          template={selectedTemplate}
          onStart={readiness => {
            setShowReadinessModal(false);
            onStartStrength(selectedTemplate, readiness);
          }}
          onClose={() => setShowReadinessModal(false)}
        />
      )}
    </div>
  );
};
