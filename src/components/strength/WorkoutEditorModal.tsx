import React, { useState } from 'react';
import { WorkoutTemplate, WorkoutExercisePrescription } from '../../types/workout';
import { EXERCISE_LIBRARY } from '../../db/exerciseLibrary';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';

interface Props {
  template: WorkoutTemplate;
  onSave: (updatedTemplate: WorkoutTemplate) => void;
  onClose: () => void;
}

export const WorkoutEditorModal: React.FC<Props> = ({ template, onSave, onClose }) => {
  const [exercises, setExercises] = useState<WorkoutExercisePrescription[]>([...template.exercises]);
  const [showAddList, setShowAddList] = useState<boolean>(false);

  const handleUpdate = (index: number, partial: Partial<WorkoutExercisePrescription>) => {
    setExercises(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...partial };
      return copy;
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    setExercises(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExercise = (exerciseId: string) => {
    const def = EXERCISE_LIBRARY[exerciseId];
    if (!def) return;
    const newPrescription: WorkoutExercisePrescription = {
      exerciseId,
      sets: def.defaultSets,
      targetRepRange: def.defaultRepRange,
      startingWeightKg: 0,
      restSeconds: def.defaultRestSeconds
    };
    setExercises(prev => [...prev, newPrescription]);
    setShowAddList(false);
  };

  const handleSave = () => {
    onSave({
      ...template,
      exercises
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="swiss-badge accent" style={{ marginBottom: '4px' }}>Edit Programme</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{template.name}</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Exercises List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {exercises.map((p, idx) => {
            const def = EXERCISE_LIBRARY[p.exerciseId];
            return (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    {idx + 1}. {def ? def.name : p.exerciseId}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-outline btn-sm"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === exercises.length - 1}
                      className="btn btn-outline btn-sm"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="btn btn-outline btn-sm"
                      style={{ width: '28px', height: '28px', padding: 0, color: 'var(--color-danger)' }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Edit Controls Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '2px' }}>
                      Sets
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={p.sets}
                      onChange={e => handleUpdate(idx, { sets: Number(e.target.value) })}
                      className="input-field font-mono"
                      style={{ height: '36px', fontSize: '13px', textAlign: 'center' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '2px' }}>
                      Reps Range
                    </label>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        value={p.targetRepRange.min}
                        onChange={e =>
                          handleUpdate(idx, {
                            targetRepRange: { ...p.targetRepRange, min: Number(e.target.value) }
                          })
                        }
                        className="input-field font-mono"
                        style={{ height: '36px', fontSize: '12px', textAlign: 'center', padding: 0 }}
                      />
                      <span>–</span>
                      <input
                        type="number"
                        min="1"
                        value={p.targetRepRange.max}
                        onChange={e =>
                          handleUpdate(idx, {
                            targetRepRange: { ...p.targetRepRange, max: Number(e.target.value) }
                          })
                        }
                        className="input-field font-mono"
                        style={{ height: '36px', fontSize: '12px', textAlign: 'center', padding: 0 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '2px' }}>
                      Rest (Sec)
                    </label>
                    <input
                      type="number"
                      step="15"
                      min="15"
                      max="300"
                      value={p.restSeconds}
                      onChange={e => handleUpdate(idx, { restSeconds: Number(e.target.value) })}
                      className="input-field font-mono"
                      style={{ height: '36px', fontSize: '13px', textAlign: 'center' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '2px' }}>
                    Starting Load (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={p.startingWeightKg || 0}
                    onChange={e => handleUpdate(idx, { startingWeightKg: Number(e.target.value) })}
                    className="input-field font-mono"
                    style={{ height: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Exercise Selector */}
        {showAddList ? (
          <div
            style={{
              padding: '12px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Select Exercise</div>
              <button onClick={() => setShowAddList(false)} className="btn btn-outline btn-sm" style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}>
                Cancel
              </button>
            </div>
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.values(EXERCISE_LIBRARY).map(def => (
                <button
                  key={def.id}
                  onClick={() => handleAddExercise(def.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>{def.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{def.primaryMuscles[0]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddList(true)}
            className="btn btn-outline btn-full btn-sm"
            style={{ marginBottom: '16px', borderStyle: 'dashed' }}
          >
            <Plus size={14} /> Add Exercise to Workout
          </button>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>
            <Check size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
