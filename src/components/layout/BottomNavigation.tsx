import React from 'react';
import { Calendar, Dumbbell, Activity, LineChart, Sliders } from 'lucide-react';

export type NavTab = 'today' | 'strength' | 'run' | 'progress' | 'settings';

interface Props {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<Props> = ({ currentTab, onChangeTab }) => {
  return (
    <nav className="bottom-nav">
      <button
        onClick={() => onChangeTab('today')}
        className={`nav-item ${currentTab === 'today' ? 'active' : ''}`}
      >
        <Calendar size={20} strokeWidth={currentTab === 'today' ? 2.5 : 1.8} />
        <span>Today</span>
      </button>

      <button
        onClick={() => onChangeTab('strength')}
        className={`nav-item ${currentTab === 'strength' ? 'active' : ''}`}
      >
        <Dumbbell size={20} strokeWidth={currentTab === 'strength' ? 2.5 : 1.8} />
        <span>Strength</span>
      </button>

      <button
        onClick={() => onChangeTab('run')}
        className={`nav-item ${currentTab === 'run' ? 'active' : ''}`}
      >
        <Activity size={20} strokeWidth={currentTab === 'run' ? 2.5 : 1.8} />
        <span>Run</span>
      </button>

      <button
        onClick={() => onChangeTab('progress')}
        className={`nav-item ${currentTab === 'progress' ? 'active' : ''}`}
      >
        <LineChart size={20} strokeWidth={currentTab === 'progress' ? 2.5 : 1.8} />
        <span>Progress</span>
      </button>

      <button
        onClick={() => onChangeTab('settings')}
        className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
      >
        <Sliders size={20} strokeWidth={currentTab === 'settings' ? 2.5 : 1.8} />
        <span>Settings</span>
      </button>
    </nav>
  );
};
