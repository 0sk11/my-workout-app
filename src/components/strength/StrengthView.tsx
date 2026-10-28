import React, { useState } from 'react';
import { WorkoutTemplate, ReadinessCheck } from '../../types/workout';
import { EXERCISE_LIBRARY } from '../../db/exerciseLibrary';
import { StorageService } from '../../db/storage';
import { WorkoutEditorModal } from './WorkoutEditorModal';
import { ReadinessModal } from '../today/ReadinessModal';
import {
  Play,
  Edit3,
  RotateCcw,
  Clock,
  Dumbbell,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  onStartWorkout: (template: WorkoutTemplate, readiness?: ReadinessCheck) => void;
}

export const StrengthView: React.FC<Props> = ({ onStartWorkout }) => {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>(() =>
    StorageService.getStrengthWorkouts()
  );

  const [expandedId, setExpandedId] = useState<string>('upper_a');
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [readinessTemplate, setReadinessTemplate] = useState<WorkoutTemplate | null>(null);

  const handleSaveEdited = (updated: WorkoutTemplate) => {
    const updatedList = workouts.map(w => (w.id === updated.id ? updated : w));
    setWorkouts(updatedList);
    StorageService.saveStrengthWorkouts(updatedList);
    setEditingTemplate(null);
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset all strength workouts to the original Swiss programme? Customizations will be restored.')) {
      const defs = StorageService.resetStrengthWorkouts();
      setWorkouts(defs);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Strength Plans</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            3-day split: Upper A, Lower, Upper B
          </div>
        </div>
        <button
          onClick={handleResetDefault}
          className="btn btn-outline btn-sm"
          title="Reset to default programme"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Workouts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {workouts.map(workout => {
          const isExpanded = expandedId === workout.id;

          return (
            <div key={workout.id} className="swiss-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Card Header Accordion */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : workout.id)}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-surface-elevated)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className="swiss-badge accent">
                      {workout.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      ~{workout.estimatedDurationMinutes} min
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{workout.name}</h3>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {workout.targetFocus}
                  </p>

                  {/* Warmup Notes */}
                  {workout.warmupNotes && workout.warmupNotes.length > 0 && (
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '16px',
                        fontSize: '12px'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                        Warm-up Checklist
                      </strong>
                      <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {workout.warmupNotes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exercises */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {workout.exercises.map((p, idx) => {
                      const def = EXERCISE_LIBRARY[p.exerciseId];
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 12px',
                            background: 'var(--bg-surface-elevated)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                                {idx + 1}. {def ? def.name : p.exerciseId}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {p.notes || def?.safetyNotes}
                              </div>
                            </div>
                            <div className="font-mono" style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600 }}>
                              <div>{p.sets} × {p.targetRepRange.min}–{p.targetRepRange.max}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{p.restSeconds}s rest</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <button
                      onClick={() => setEditingTemplate(workout)}
                      className="btn btn-secondary"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => setReadinessTemplate(workout)}
                      className="btn btn-primary"
                    >
                      <Play size={16} fill="currentColor" /> Start Workout
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {editingTemplate && (
        <WorkoutEditorModal
          template={editingTemplate}
          onSave={handleSaveEdited}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {/* Readiness Modal */}
      {readinessTemplate && (
        <ReadinessModal
          template={readinessTemplate}
          onStart={readiness => {
            const t = readinessTemplate;
            setReadinessTemplate(null);
            onStartWorkout(t, readiness);
          }}
          onClose={() => setReadinessTemplate(null)}
        />
      )}
    </div>
  );
};
