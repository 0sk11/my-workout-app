import React, { useState } from 'react';
import { PlyometricDrill, PlyometricStage, PlyometricSessionLog } from '../../types/plyometrics';
import { StorageService } from '../../db/storage';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onSessionSaved: () => void;
}

export const PlyometricsModal: React.FC<Props> = ({ onClose, onSessionSaved }) => {
  const allDrills = StorageService.getPlyometricDrills();
  const history = StorageService.getPlyoHistory();

  // Safety Gate: Pain Assessment Check
  const [hasPain, setHasPain] = useState<boolean | null>(null);
  const [painLocation, setPainLocation] = useState<string>('');

  // Selected Stage (default to Stage 1 for beginners)
  const [activeStage, setActiveStage] = useState<PlyometricStage>(() => {
    // Check history: if user has >= 3 well-tolerated Stage 1 sessions, allow Stage 2
    const s1Count = history.filter(h => h.stage === 1 && h.toleratedWell).length;
    const s2Count = history.filter(h => h.stage === 2 && h.toleratedWell).length;
    if (s2Count >= 3) return 3;
    if (s1Count >= 3) return 2;
    return 1;
  });

  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>({});
  const [perceivedEffort, setPerceivedEffort] = useState<number>(5);
  const [toleratedWell, setToleratedWell] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  const stageDrills = allDrills.filter(d => d.stage === activeStage);

  const toggleDrillDone = (drillId: string) => {
    setCompletedDrills(prev => ({
      ...prev,
      [drillId]: !prev[drillId]
    }));
  };

  const handleSaveSession = () => {
    const doneList = stageDrills.filter(d => completedDrills[d.id]);
    const totalContacts = doneList.reduce((acc, d) => acc + d.sets * d.targetContacts, 0);

    const log: PlyometricSessionLog = {
      id: 'plyo_' + Date.now(),
      date: new Date().toISOString(),
      stage: activeStage,
      totalContacts,
      drillsCompleted: doneList.map(d => ({
        drillId: d.id,
        name: d.name,
        setsCompleted: d.sets,
        contactsPerSet: d.targetContacts
      })),
      perceivedEffort,
      toleratedWell,
      notes
    };

    StorageService.savePlyoSession(log);
    onSessionSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <span className="swiss-badge timer" style={{ marginBottom: '4px' }}>
              Optional Running Module
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Plyometrics & Durability</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ width: '32px', height: '32px', padding: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Priority note */}
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-run)' }} />
          <span>
            Strength training and consistent easy running take first priority. Plyometrics are strictly optional (max 1 session/week).
          </span>
        </div>

        {/* Step 1: Pain Check Gate */}
        {hasPain === null ? (
          <div className="swiss-card elevated" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
              Pre-Impact Safety Screening
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Do you currently feel any pain or discomfort in your feet, ankles, Achilles tendons, shins, or knees?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => setHasPain(false)}
                className="btn btn-primary"
              >
                No Pain (Cleared)
              </button>
              <button
                onClick={() => setHasPain(true)}
                className="btn btn-secondary"
              >
                Yes, Some Ache
              </button>
            </div>
          </div>
        ) : hasPain === true ? (
          /* Pain Gate Block Screen */
          <div className="swiss-card elevated" style={{ textAlign: 'center', padding: '24px 16px', borderColor: 'var(--color-danger)' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>
              Impact Drills Restricted
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '16px' }}>
              Because you reported lower-limb ache, impact jumping exercises are contraindicated today. Continuing through tendon pain risks chronic injury.
            </p>
            <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'left' }}>
              <strong>Safe alternative for today:</strong> Perform gentle ankle mobility rocks and bodyweight calf raises with 3-second lowering.
            </div>
            <button onClick={onClose} className="btn btn-outline btn-full">
              Close & Rest Tendons
            </button>
          </div>
        ) : (
          /* Cleared Drills Screen */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Stage Selector */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Stage Progression
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { stage: 1, label: 'Stage 1: Prep' },
                  { stage: 2, label: 'Stage 2: Intro' },
                  { stage: 3, label: 'Stage 3: Bounds' }
                ].map(s => (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => setActiveStage(s.stage as PlyometricStage)}
                    className={`btn btn-sm ${activeStage === s.stage ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: 0 }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drills List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stageDrills.map(drill => {
                const isDone = completedDrills[drill.id];
                return (
                  <div
                    key={drill.id}
                    onClick={() => toggleDrillDone(drill.id)}
                    style={{
                      padding: '12px',
                      background: isDone ? 'var(--bg-surface-active)' : 'var(--bg-surface-elevated)',
                      border: isDone ? '1px solid var(--color-success)' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{drill.name}</span>
                        {drill.isJumping ? (
                          <span className="swiss-badge timer" style={{ fontSize: '9px' }}>Impact</span>
                        ) : (
                          <span className="swiss-badge success" style={{ fontSize: '9px' }}>Low Impact</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {drill.description}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                        Alternative: {drill.safeAlternative}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700 }}>
                        {drill.sets} × {drill.targetContacts} contacts
                      </span>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isDone ? 'var(--color-success)' : 'transparent',
                          color: '#fff'
                        }}
                      >
                        {isDone && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Log Button */}
            <button
              onClick={handleSaveSession}
              disabled={Object.values(completedDrills).filter(Boolean).length === 0}
              className="btn btn-primary btn-full"
            >
              Log Plyometrics Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
