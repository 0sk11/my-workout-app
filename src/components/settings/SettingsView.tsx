import React, { useState } from 'react';
import { StorageService } from '../../db/storage';
import { EquipmentInventory } from '../../types/equipment';
import { AppSettings, ScheduledDay, ScheduledActivityType } from '../../types/user';
import { EquipmentService } from '../../services/equipmentService';
import { ScheduleChecker } from '../../services/scheduleChecker';
import {
  Sliders,
  Dumbbell,
  Calendar,
  Volume2,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';

interface Props {
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const SettingsView: React.FC<Props> = ({ theme, onThemeChange }) => {
  const [equipment, setEquipment] = useState<EquipmentInventory>(() =>
    StorageService.getEquipment()
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    StorageService.getSettings()
  );
  const [schedule, setSchedule] = useState<ScheduledDay[]>(() =>
    StorageService.getSchedule()
  );

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Available symmetric dumbbell loads calculated dynamically
  const availablePairLoads = EquipmentService.getAvailableDumbbellWeights(equipment, false);
  const availableSingleLoads = EquipmentService.getAvailableDumbbellWeights(equipment, true);

  // Check schedule conflict warnings
  const conflicts = ScheduleChecker.checkConflicts(schedule);

  const updateEquipment = (partial: Partial<EquipmentInventory>) => {
    const updated = { ...equipment, ...partial };
    setEquipment(updated);
    StorageService.saveEquipment(updated);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const updateScheduleDay = (dayIndex: number, primaryActivity: ScheduledActivityType) => {
    const copy = [...schedule];
    copy[dayIndex] = { ...copy[dayIndex], primaryActivity };
    setSchedule(copy);
    StorageService.saveSchedule(copy);
  };

  // Export JSON backup
  const handleExportJson = () => {
    const jsonStr = StorageService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinetic_fitness_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (window.confirm('Importing this backup will update your workouts, equipment, and history. Proceed?')) {
        const res = StorageService.importDataJson(content);
        if (res.success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus(res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Reset all data
  const handleResetApp = () => {
    if (window.confirm('Reset ALL data to initial factory default? This clears all workout logs and restores default settings.')) {
      StorageService.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Preferences & Equipment</h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Configure your dumbbells, schedule, sound, and data backup
        </div>
      </div>

      {/* Section 1: Equipment Inventory Manager */}
      <div className="swiss-card elevated">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Dumbbell size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Dumbbells & Weights Inventory</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Handle Weight (Kg each)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={equipment.dumbbellHandleWeightKg}
              onChange={e => updateEquipment({ dumbbellHandleWeightKg: Number(e.target.value) })}
              className="input-field font-mono"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Handle Count
            </label>
            <input
              type="number"
              min="1"
              max="2"
              value={equipment.dumbbellHandleCount}
              onChange={e => updateEquipment({ dumbbellHandleCount: Number(e.target.value) })}
              className="input-field font-mono"
            />
          </div>
        </div>

        {/* Plates Inventory List */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Plates Inventory
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {equipment.plates.map((plate, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--bg-surface)',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <span className="font-mono" style={{ fontWeight: 700 }}>
                  {plate.weightKg} kg plate
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Count:</span>
                  <input
                    type="number"
                    min="0"
                    value={plate.count}
                    onChange={e => {
                      const copy = [...equipment.plates];
                      copy[idx] = { ...copy[idx], count: Number(e.target.value) };
                      updateEquipment({ plates: copy });
                    }}
                    className="input-field font-mono"
                    style={{ width: '60px', height: '32px', textAlign: 'center', padding: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Computed Dumbbell Loads */}
        <div
          style={{
            padding: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: 1.5
          }}
        >
          <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Calculated Symmetrical Dumbbell Increments:
          </strong>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <strong>Pair of DBs: </strong>
            <span className="font-mono">
              {availablePairLoads.map(c => `${c.totalDumbbellWeightKg}kg`).join(', ')}
            </span>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            <strong>Single DB (Goblet): </strong>
            <span className="font-mono">
              {availableSingleLoads.map(c => `${c.totalDumbbellWeightKg}kg`).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Weekly Schedule Manager & Conflict Checker */}
      <div className="swiss-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calendar size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Weekly Schedule Editor</h3>
        </div>

        {/* Conflict Warning */}
        {conflicts.map((c, i) => (
          <div
            key={i}
            style={{
              padding: '10px 12px',
              borderRadius: '4px',
              background: 'var(--color-timer-muted)',
              border: '1px solid var(--color-timer)',
              fontSize: '12px',
              marginBottom: '12px'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-timer)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <AlertTriangle size={14} /> Schedule Conflict Warning
            </div>
            <div>{c.message}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{c.suggestion}</div>
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {schedule.map((item, idx) => (
            <div
              key={item.day}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: '4px'
              }}
            >
              <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px', width: '80px' }}>
                {item.dayLabel}
              </span>
              <select
                value={item.primaryActivity}
                onChange={e => updateScheduleDay(idx, e.target.value as ScheduledActivityType)}
                className="input-field"
                style={{ height: '36px', fontSize: '12px', flex: 1, maxWidth: '200px' }}
              >
                <option value="upper_a">Upper A (Foundational)</option>
                <option value="lower">Lower (Running Strength)</option>
                <option value="upper_b">Upper B (Balanced)</option>
                <option value="easy_run">Easy / Zone 2 Run</option>
                <option value="long_run">Long Aerobic Run</option>
                <option value="intervals">Interval Workout</option>
                <option value="tempo_run">Tempo Run</option>
                <option value="recovery_run">Recovery Run</option>
                <option value="rest">Rest & Recovery</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Timer & Audio Preferences */}
      <div className="swiss-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Volume2 size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Timer & Feedback</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Audio Chimes & Countdown</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Web Audio synthesized tones</div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => updateSettings({ soundEnabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Haptic Vibration</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Vibrates on set and rest end</div>
            </div>
            <input
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={e => updateSettings({ vibrationEnabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Auto-Start Rest Timer</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Starts automatically on set completion</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartRestTimer}
              onChange={e => updateSettings({ autoStartRestTimer: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Theme */}
      <div className="swiss-card">
        <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px' }}>Interface Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {(['dark', 'light', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`btn btn-sm ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Section 5: Data Backup (JSON Export / Import) */}
      <div className="swiss-card">
        <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>Data Backup & Restore</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Export your entire workout history, progression recommendations, and custom templates as a clean JSON file.
        </p>

        {importStatus && (
          <div style={{ padding: '8px 10px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', fontSize: '12px', marginBottom: '10px' }}>
            {importStatus}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <button onClick={handleExportJson} className="btn btn-outline btn-sm">
            <Download size={14} /> Export JSON
          </button>
          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={14} /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
          </label>
        </div>

        <button
          onClick={handleResetApp}
          className="btn btn-outline btn-full btn-sm"
          style={{ color: 'var(--color-danger)', borderColor: 'var(--border-subtle)' }}
        >
          <RotateCcw size={14} /> Factory Reset All Data
        </button>
      </div>
    </div>
  );
};
