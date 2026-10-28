import React, { useState } from 'react';
import { StorageService } from '../../db/storage';
import { EXERCISE_LIBRARY } from '../../db/exerciseLibrary';
import {
  Trophy,
  Calendar,
  Activity,
  Dumbbell,
  TrendingUp,
  Award,
  Clock,
  Trash2
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const [tab, setTab] = useState<'strength' | 'running' | 'history'>('strength');

  const history = StorageService.getWorkoutHistory();
  const runHistory = StorageService.getRunningHistory();
  const plyoHistory = StorageService.getPlyoHistory();
  const profile = StorageService.getUserProfile();

  // Strength PRs list
  const prs: { exercise: string; maxWeight: number; maxReps: number; date: string }[] = [];
  const exerciseMap: Record<string, { weights: number[]; reps: number[]; dates: string[] }> = {};

  history.forEach(session => {
    session.exerciseLogs.forEach(log => {
      if (!exerciseMap[log.exerciseId]) {
        exerciseMap[log.exerciseId] = { weights: [], reps: [], dates: [] };
      }
      log.completedSets.forEach(set => {
        exerciseMap[log.exerciseId].weights.push(set.weightKg);
        exerciseMap[log.exerciseId].reps.push(set.actualReps);
        exerciseMap[log.exerciseId].dates.push(set.completedAt);
      });
    });
  });

  Object.entries(exerciseMap).forEach(([id, data]) => {
    const def = EXERCISE_LIBRARY[id];
    const name = def ? def.name : id;
    const maxWeight = Math.max(...data.weights, 0);
    const maxReps = Math.max(...data.reps, 0);
    prs.push({
      exercise: name,
      maxWeight,
      maxReps,
      date: data.dates[data.dates.length - 1]
    });
  });

  // Key lift selected for chart
  const [selectedLift, setSelectedLift] = useState<string>(
    Object.keys(exerciseMap)[0] || 'dumbbell_floor_press'
  );

  const liftData = exerciseMap[selectedLift];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Training Progress</h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Consistency, load trajectory, and running durability
        </div>
      </div>

      {/* Segmented Control */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
        <button
          onClick={() => setTab('strength')}
          className={`btn btn-sm ${tab === 'strength' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Dumbbell size={14} /> Strength
        </button>
        <button
          onClick={() => setTab('running')}
          className={`btn btn-sm ${tab === 'running' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Activity size={14} /> Running
        </button>
        <button
          onClick={() => setTab('history')}
          className={`btn btn-sm ${tab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Calendar size={14} /> Log History
        </button>
      </div>

      {/* Tab 1: Strength Progress */}
      {tab === 'strength' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Push-Up and Pull-Up Trajectory Card */}
          <div className="swiss-card elevated">
            <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Bodyweight Progression Targets
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Push-Up Capacity</div>
                <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>
                  {profile.currentPushUpMax} <span style={{ fontSize: '13px', fontWeight: 500 }}>reps</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Next Milestone: 8 consecutive reps with controlled tempo
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Assisted Pull-Ups</div>
                <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>
                  {profile.currentPullUpBandAssistedReps} <span style={{ fontSize: '13px', fontWeight: 500 }}>reps</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Next Milestone: Reduce band assistance to medium
                </div>
              </div>
            </div>
          </div>

          {/* SVG Load Progression Graph */}
          <div className="swiss-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4>Lift Trajectory</h4>
              {Object.keys(exerciseMap).length > 0 && (
                <select
                  value={selectedLift}
                  onChange={e => setSelectedLift(e.target.value)}
                  className="input-field font-mono"
                  style={{ width: 'auto', height: '32px', fontSize: '11px', padding: '0 8px' }}
                >
                  {Object.keys(exerciseMap).map(id => {
                    const def = EXERCISE_LIBRARY[id];
                    return (
                      <option key={id} value={id}>
                        {def ? def.name : id}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {liftData && liftData.weights.length > 0 ? (
              <div>
                <svg viewBox="0 0 300 120" style={{ width: '100%', height: '120px' }}>
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  <line x1="20" y1="60" x2="280" y2="60" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="280" y2="100" stroke="var(--border-subtle)" strokeDasharray="3 3" />

                  {/* Draw Polyline */}
                  {(() => {
                    const max = Math.max(...liftData.weights, 10);
                    const min = 0;
                    const pts = liftData.weights.map((w, i) => {
                      const x = 20 + (i / Math.max(liftData.weights.length - 1, 1)) * 260;
                      const y = 100 - (w / max) * 80;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          points={pts}
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {liftData.weights.map((w, i) => {
                          const x = 20 + (i / Math.max(liftData.weights.length - 1, 1)) * 260;
                          const y = 100 - (w / max) * 80;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="var(--accent)"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  <span>First logged session</span>
                  <span className="font-mono">Current: {liftData.weights[liftData.weights.length - 1]} kg</span>
                  <span>Latest</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                Complete strength workouts to view your double-progression trajectory curve.
              </div>
            )}
          </div>

          {/* Personal Records Showcase */}
          <div className="swiss-card">
            <h4>Personal Records (PRs)</h4>
            {prs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {prs.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: '4px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.exercise}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        Logged {new Date(p.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                      {p.maxWeight > 0 ? `${p.maxWeight} kg` : `${p.maxReps} reps`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                No PRs recorded yet. Finish a session to establish your baseline!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Running Progress */}
      {tab === 'running' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Running Totals */}
          <div className="swiss-card elevated">
            <h4>All-Time Running Stats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px', textAlign: 'center' }}>
              <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Distance</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-run)', marginTop: '2px' }}>
                  {runHistory.reduce((acc, r) => acc + (r.distanceKm || 0), 0).toFixed(1)} <span style={{ fontSize: '11px' }}>km</span>
                </div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Runs</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                  {runHistory.length}
                </div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Plyo Sessions</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                  {plyoHistory.length}
                </div>
              </div>
            </div>
          </div>

          {/* Running Logs List */}
          <div className="swiss-card">
            <h4>Recent Runs</h4>
            {runHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {runHistory.slice(0, 10).map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{r.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {new Date(r.date).toLocaleDateString()} • {Math.round(r.durationSeconds / 60)} min
                      </div>
                    </div>
                    <div className="font-mono" style={{ textAlign: 'right', fontSize: '13px', fontWeight: 700 }}>
                      <div style={{ color: 'var(--color-run)' }}>{r.distanceKm} km</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{r.averagePaceMinPerKm}/km</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                No running sessions logged yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: History & Session Details */}
      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4>Completed Workouts ({history.length})</h4>
          {history.length > 0 ? (
            history.map(session => (
              <div key={session.id} className="swiss-card" style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span className="swiss-badge accent" style={{ marginBottom: '2px' }}>
                      Strength
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: 800 }}>{session.templateName}</h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {new Date(session.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this workout log?')) {
                        StorageService.deleteWorkoutSession(session.id);
                        window.location.reload();
                      }
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '28px', height: '28px', padding: 0, color: 'var(--text-tertiary)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Duration: <strong className="font-mono">{Math.round(session.durationSeconds / 60)} min</strong> • Effort RPE: <strong className="font-mono">{session.rpe || 7}/10</strong>
                </div>

                {/* Exercises Logged Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {session.exerciseLogs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      style={{
                        fontSize: '11px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 6px',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: '3px'
                      }}
                    >
                      <span>{log.exerciseName}</span>
                      <span className="font-mono">
                        {log.skipped
                          ? 'Skipped'
                          : log.completedSets
                              .map(s => `${s.actualReps}r${s.weightKg > 0 ? `@${s.weightKg}k` : ''}`)
                              .join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="swiss-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No strength workouts recorded yet. Start a session from the Today tab!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
