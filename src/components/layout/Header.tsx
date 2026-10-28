import React from 'react';
import { Sun, Moon, Dumbbell, Play } from 'lucide-react';

interface Props {
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  hasActiveWorkout: boolean;
  onResumeWorkout: () => void;
}

export const Header: React.FC<Props> = ({
  theme,
  onToggleTheme,
  hasActiveWorkout,
  onResumeWorkout
}) => {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--accent)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <Dumbbell size={16} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1 }}>
            KINETIC
          </div>
          <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Strength & Running Coach
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {hasActiveWorkout && (
          <button
            onClick={onResumeWorkout}
            className="btn btn-sm btn-primary"
            style={{ padding: '0 10px', height: '32px', fontSize: '12px' }}
          >
            <Play size={12} fill="currentColor" />
            Resume
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="btn btn-sm btn-outline"
          aria-label="Toggle light/dark theme"
          style={{ width: '36px', height: '36px', padding: 0 }}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
};
