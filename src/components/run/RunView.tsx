import React, { useState } from 'react';
import { RunningWorkoutTemplate, RunningSessionLog } from '../../types/running';
import { StorageService } from '../../db/storage';
import { GuidedRunModal } from './GuidedRunModal';
import { PlyometricsModal } from '../plyometrics/PlyometricsModal';
import {
  Activity,
  Play,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle,
  Zap
} from 'lucide-react';

export const RunView: React.FC = () => {
  const runningTemplates = StorageService.getRunningWorkouts();
  const runHistory = StorageService.getRunningHistory();
  const plyoHistory = StorageService.getPlyoHistory();

  const [activeRunTemplate, setActiveRunTemplate] = useState<RunningWorkoutTemplate | null>(null);
  const [showPlyoModal, setShowPlyoModal] = useState<boolean>(false);

  // Compute Weekly Running Totals (last 7 days)
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyRuns = runHistory.filter(r => new Date(r.date) >= weekStart);
  const weeklyKm = weeklyRuns.reduce((sum, r) => sum + (r.distanceKm || 0), 0);
  const weeklyMinutes = Math.round(
    weeklyRuns.reduce((sum, r) => sum + r.durationSeconds, 0) / 60
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Running Companion</h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Zone 2 aerobic base, structured intervals, and durability
        </div>
      </div>

      {/* Weekly Mileage Metric Card */}
      <div className="swiss-card elevated" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="swiss-badge run">Weekly Volume</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Last 7 Days</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
          <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Distance</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-run)' }}>
              {weeklyKm.toFixed(1)} <span style={{ fontSize: '11px' }}>km</span>
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Time</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700 }}>
              {weeklyMinutes} <span style={{ fontSize: '11px' }}>min</span>
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Sessions</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700 }}>
              {weeklyRuns.length}
            </div>
          </div>
        </div>
      </div>

      {/* Optional Plyometrics Banner */}
      <div
        className="swiss-card"
        style={{
          borderLeft: '4px solid var(--color-timer)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="var(--color-timer)" />
            <span style={{ fontWeight: 800, fontSize: '13px' }}>Optional Plyometrics</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Ankle stiffness & Achilles elasticity drills (Max 1/week)
          </div>
        </div>
        <button
          onClick={() => setShowPlyoModal(true)}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px' }}
        >
          View Drills
        </button>
      </div>

      {/* Running Workouts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
          Structured Running Sessions
        </h4>

        {runningTemplates.map(template => (
          <div key={template.id} className="swiss-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <span className="swiss-badge run" style={{ marginBottom: '4px' }}>
                  {template.runType.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{template.title}</h3>
              </div>
              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700 }}>
                ~{template.targetDurationMinutes} min
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              {template.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              <span>Target Effort: <strong style={{ color: 'var(--text-primary)' }}>{template.perceivedEffortTarget}</strong></span>
            </div>

            <button
              onClick={() => setActiveRunTemplate(template)}
              className="btn btn-run btn-full btn-sm"
              style={{ height: '40px' }}
            >
              <Play size={14} fill="currentColor" />
              Start Guided Run
            </button>
          </div>
        ))}
      </div>

      {/* Guided Run Modal */}
      {activeRunTemplate && (
        <GuidedRunModal
          template={activeRunTemplate}
          onFinishRun={() => setActiveRunTemplate(null)}
          onClose={() => setActiveRunTemplate(null)}
        />
      )}

      {/* Plyometrics Modal */}
      {showPlyoModal && (
        <PlyometricsModal
          onClose={() => setShowPlyoModal(false)}
          onSessionSaved={() => {}}
        />
      )}
    </div>
  );
};
