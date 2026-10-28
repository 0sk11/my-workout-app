import React, { useState } from 'react';
import { WorkoutTemplate, ReadinessCheck } from '../../types/workout';
import { EXERCISE_LIBRARY } from '../../db/exerciseLibrary';
import { AlertCircle, CheckCircle2, Play, X, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  template: WorkoutTemplate;
  onStart: (readiness: ReadinessCheck) => void;
  onClose: () => void;
}

export const ReadinessModal: React.FC<Props> = ({ template, onStart, onClose }) => {
  const [energy, setEnergy] = useState<'low' | 'normal' | 'high'>('normal');
  const [soreness, setSoreness] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [painSymptoms, setPainSymptoms] = useState<boolean>(false);
  const [painLocation, setPainLocation] = useState<string>('');

  // Evaluate advice
  const isLighterRecommended = energy === 'low' || soreness === 'severe' || soreness === 'moderate';

  const handleStart = () => {
    onStart({
      energy,
      soreness,
      painSymptoms,
      painLocation: painSymptoms ? painLocation : undefined,
      adjustedVolume: isLighterRecommended
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span className="swiss-badge accent" style={{ marginBottom: '6px' }}>Pre-Session Readiness</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{template.name}</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Est. {template.estimatedDurationMinutes} min • {template.exercises.length} exercises
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Readiness Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          {/* Energy */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              1. Current Energy Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['low', 'normal', 'high'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergy(lvl)}
                  className={`btn btn-sm ${energy === lvl ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Soreness */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              2. Muscle Soreness
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {(['none', 'mild', 'moderate', 'severe'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSoreness(lvl)}
                  className={`btn btn-sm ${soreness === lvl ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', padding: '0 4px', fontSize: '12px' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Symptoms */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              3. Joint Pain or Unusual Symptoms?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPainSymptoms(false)}
                className={`btn btn-sm ${!painSymptoms ? 'btn-primary' : 'btn-secondary'}`}
              >
                No pain
              </button>
              <button
                type="button"
                onClick={() => setPainSymptoms(true)}
                className={`btn btn-sm ${painSymptoms ? 'btn-primary' : 'btn-secondary'}`}
              >
                Yes, discomfort
              </button>
            </div>
            {painSymptoms && (
              <div style={{ marginTop: '8px' }}>
                <input
                  type="text"
                  placeholder="Where? (e.g. left shoulder, knee, lower back)"
                  value={painLocation}
                  onChange={e => setPainLocation(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '13px' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Training Guidance Banner */}
        {painSymptoms ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              marginBottom: '16px',
              fontSize: '12px',
              lineHeight: 1.4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-danger)', marginBottom: '4px' }}>
              <ShieldAlert size={16} />
              Safety Guardrail
            </div>
            Never train through sharp joint or tendon pain. If a movement causes pain, use the in-workout <strong>Substitute</strong> or <strong>Skip</strong> button. Stop immediately if symptoms persist.
          </div>
        ) : isLighterRecommended ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid var(--color-timer)',
              marginBottom: '16px',
              fontSize: '12px',
              lineHeight: 1.4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-timer)', marginBottom: '4px' }}>
              <Sparkles size={16} />
              Smart Adaptation: Lighter Session
            </div>
            Lower energy or muscle soreness detected. We suggest keeping 3+ reps in reserve and taking generous 90–120s rest periods today.
          </div>
        ) : null}

        {/* Exercises Preview */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            Planned Exercises ({template.exercises.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {template.exercises.map((p, idx) => {
              const def = EXERCISE_LIBRARY[p.exerciseId];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{def ? def.name : p.exerciseId}</span>
                  <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {p.sets} × {p.targetRepRange.min}–{p.targetRepRange.max} reps
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button onClick={handleStart} className="btn btn-primary btn-full btn-lg">
          <Play size={18} fill="currentColor" />
          Begin Session
        </button>
      </div>
    </div>
  );
};
