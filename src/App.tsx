import React, { useState, useEffect } from 'react';
import { NavTab, BottomNavigation } from './components/layout/BottomNavigation';
import { Header } from './components/layout/Header';
import { TodayView } from './components/today/TodayView';
import { StrengthView } from './components/strength/StrengthView';
import { RunView } from './components/run/RunView';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { ActiveWorkoutModal } from './components/activeWorkout/ActiveWorkoutModal';
import { useActiveWorkout } from './hooks/useActiveWorkout';
import { StorageService } from './db/storage';
import { WorkoutTemplate, ReadinessCheck } from './types/workout';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return StorageService.getSettings().theme || 'system';
  });

  const [showActiveModal, setShowActiveModal] = useState<boolean>(false);

  const {
    activeState,
    startWorkout,
    completeSet,
    proceedToNextExercise,
    skipExercise,
    substituteExercise,
    dismissRestTimer,
    togglePauseWorkout,
    finishWorkout,
    discardWorkout
  } = useActiveWorkout();

  // If an active workout exists on initial load, show modal
  useEffect(() => {
    if (activeState) {
      setShowActiveModal(true);
    }
  }, [activeState]);

  // Apply Theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    StorageService.saveSettings({ ...StorageService.getSettings(), theme: nextTheme });
  };

  const handleStartStrength = (template: WorkoutTemplate, readiness?: ReadinessCheck) => {
    startWorkout(template, readiness);
    setShowActiveModal(true);
  };

  return (
    <div className="app-viewport">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        hasActiveWorkout={!!activeState}
        onResumeWorkout={() => setShowActiveModal(true)}
      />

      {/* Main Content Scroll Area */}
      <main className="app-content">
        {currentTab === 'today' && (
          <TodayView
            onStartStrength={handleStartStrength}
            onOpenRun={runId => setCurrentTab('run')}
            hasActiveWorkout={!!activeState}
            onResumeWorkout={() => setShowActiveModal(true)}
          />
        )}

        {currentTab === 'strength' && (
          <StrengthView onStartWorkout={handleStartStrength} />
        )}

        {currentTab === 'run' && <RunView />}

        {currentTab === 'progress' && <ProgressView />}

        {currentTab === 'settings' && (
          <SettingsView
            theme={theme}
            onThemeChange={newTheme => {
              setTheme(newTheme);
              StorageService.saveSettings({ ...StorageService.getSettings(), theme: newTheme });
            }}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onChangeTab={tab => setCurrentTab(tab)}
      />

      {/* Full-Screen Active Workout Experience */}
      {showActiveModal && activeState && (
        <ActiveWorkoutModal
          activeState={activeState}
          onCompleteSet={completeSet}
          onProceedToNextExercise={proceedToNextExercise}
          onSkipExercise={skipExercise}
          onSubstituteExercise={substituteExercise}
          onDismissRestTimer={dismissRestTimer}
          onTogglePauseWorkout={togglePauseWorkout}
          onFinishWorkout={(rpe, notes) => {
            finishWorkout(rpe, notes);
            setShowActiveModal(false);
          }}
          onDiscardWorkout={() => {
            if (window.confirm('Discard active workout and lose uncompleted sets?')) {
              discardWorkout();
              setShowActiveModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
