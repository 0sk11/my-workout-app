# How Kinetic Works: Complete Technical & Training Architecture

This document provides a comprehensive, end-to-end explanation of how the **Kinetic Personal Strength & Running Coach** application is architected, how its algorithms function, and how data flows through the system.

---

## 1. Architectural Philosophy & Design System

Kinetic is built as a **precision training instrument** rather than a gamified or social fitness app. Its interface is inspired by **Swiss modernist design** (Max Bill, Josef Müller-Brockmann) and adheres to strict engineering principles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              USER INTERACTION                          │
│        (Today • Strength • Running • Plyometrics • Progress)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ACTIVE STATE & HOOKS                            │
│    useActiveWorkout (Session State)  │  useWorkoutTimer (Drift-Proof)   │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
┌───────────────────────────────────┐   ┌────────────────────────────────┐
│        INTELLIGENCE ENGINES       │   │       DEVICE HARDWARE & I/O    │
│  • ProgressionEngine (Double Prog)│   │  • Web Audio API (Chimes)      │
│  • EquipmentService (Plate Math)  │   │  • Vibration API (Haptics)     │
│  • ScheduleChecker (48h Spacing)  │   │  • Capacitor Android Bridge    │
└───────────────────┬───────────────┘   └────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PERSISTENCE & STORAGE LAYER                        │
│            StorageService (Auto-Sync LocalStorage + IndexedDB)          │
│               JSON Export / Import Backup Engine                       │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Design Rules
- **8-Point Spatial Grid**: Spacing, margins, padding, and heights adhere strictly to increments of 4px and 8px (`8px`, `16px`, `24px`, `32px`, `48px`).
- **Tabular Numerals**: Monospace font feature (`tnum`, `zero`) for timers, reps, and loads so digits never jitter or shift layouts during live countdowns.
- **Accessible Contrast**: WCAG AAA contrast in both Dark and Light modes using functional Swiss accents:
  - *Signal Vermilion (`#e5484d`)*: Strength actions, active exercises, and primary triggers.
  - *Athletic Cobalt (`#3b82f6`)*: Running modules, intervals, and aerobic metrics.
  - *Precision Amber (`#f59e0b`)*: Rest timers and countdown warnings.
  - *Tuned Emerald (`#10b981`)*: Completed sets, PRs, and cleared status.

---

## 2. Data Model & Persistence Engine (`src/db/storage.ts`)

Kinetic requires **zero account creation or cloud dependencies**. All training history, progression models, equipment configurations, and active sessions reside locally on the device.

### 1. Active Workout Crash & Refresh Recovery
When a workout starts, every single action—logging a set, changing reps, adjusting rest, or pausing—is immediately synchronized to local storage via the `useActiveWorkout` hook:
```typescript
// Every state transition auto-persists to disk:
useEffect(() => {
  StorageService.saveActiveWorkout(activeState);
}, [activeState]);
```
If the user accidentally closes their browser tab, refreshes the page, or the mobile OS reclaims memory while backgrounded, reopening the app displays a prominent **"Resume Workout"** banner that restores the exact exercise, set number, and logged weights.

### 2. Full JSON Backup & Restore
In the **Settings** tab:
- **Export JSON**: Serializes user profile, equipment inventory, templates, workout history, running logs, and progression recommendations into a formatted `.json` file.
- **Import JSON**: Performs strict validation to ensure arrays and required fields exist, rejecting malformed data before giving the user a confirmation prompt.

---

## 3. The Active Workout Engine (`useActiveWorkout.ts` & `ActiveWorkoutModal.tsx`)

The active workout mode is the central experience of the application.

### Step 1: Pre-Session Readiness Check
Before exercises begin, the user answers 3 quick physiological questions:
1. **Energy Level**: Low / Normal / High
2. **Muscle Soreness**: None / Mild / Moderate / Severe
3. **Joint Pain / Symptoms**: Yes / No (with location prompt)

**How the app responds**:
- If **Joint Pain** is reported: Displays a red safety alert urging the user not to train through joint pain, and activates the in-workout **Substitute** or **Skip** buttons.
- If **Low Energy** or **Severe Soreness** is reported: Recommends taking an extra 30s rest between sets and leaving $\ge 3$ reps in reserve.

### Step 2: Dumbbell Plate Configuration Calculator (`equipmentService.ts`)
The app never assumes plate weight equals dumbbell weight. The user enters their handle weight (e.g. 2.0 kg) and plate counts (e.g. four 2 kg, four 3 kg).

During an exercise (e.g., Dumbbell Floor Press at 6.0 kg per hand):
- The algorithm calculates all **symmetrical** plate loading options (equal plates on both sides of each handle).
- For a pair of dumbbells: divides available plate pairs across 2 handles.
- For a single dumbbell (Goblet Squat): uses all available plates on 1 handle.
- Displays an instant plate guide:
  > **Plates Per Dumbbell:** `2 kg handle + 2 × 2.0 kg plates (1 per side) = 6.0 kg`

### Step 3: Logging Sets & Reps in Reserve (RIR)
When the user taps **Complete Set**:
- Records completed reps, load, and user-selected RIR (`3+ RIR (Comfortable)`, `2 RIR (Target)`, `1 RIR (Challenging)`, `0 RIR (Failure)`).
- Triggers a subtle haptic vibration (`navigator.vibrate(40)`).
- If more sets remain: automatically initiates the rest countdown timer.
- If all sets of the exercise are complete: advances to the **Exercise Transition Screen**.
- If the final set of the final exercise is complete: transitions to the **Workout Summary & Rating Screen**.

### Step 4: Drift-Proof Rest Countdown Timer (`useWorkoutTimer.ts`)
Standard JavaScript `setInterval` timers drift significantly on mobile devices when the screen locks or the browser tab is backgrounded due to OS CPU throttling.

Kinetic solves this by using **absolute epoch timestamps**:
```typescript
const now = Date.now();
const endTime = now + seconds * 1000;
```
On every animation frame or tick, remaining seconds are calculated as:
$$\text{remaining} = \max\left(0, \left\lceil \frac{\text{endTime} - \text{Date.now()}}{1000} \right\rceil\right)$$
Even if the phone stays asleep for 90 seconds, unlocking the phone instantly recovers the exact elapsed time with zero drift.

### Step 5: Web Audio API Synthesizer (`audioService.ts`)
Rather than relying on large external audio files that might fail to download or cache offline, Kinetic uses the browser's native **Web Audio API** (`AudioContext` oscillator):
- **Countdown Ticks**: 880 Hz sine wave tone on 3, 2, 1 seconds.
- **Rest Completed**: Two-tone harmonic chime (C5 at 523 Hz $\to$ G5 at 784 Hz).
- **Workout Victory**: 4-note major chord (C5, E5, G5, C6) with exponential gain decay.

---

## 4. Conservative Double-Progression Engine (`progressionEngine.ts`)

Kinetic implements a strict, transparent double-progression system tailored for beginners:

```
                        ┌──────────────────────────────┐
                        │   Start with Prescribed      │
                        │   Weight & Rep Range (e.g.8-12)│
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │    Did ALL sets reach 12     │
                        │    reps with >= 2 RIR?       │
                        └──────┬────────────────┬──────┘
                               │                │
                        YES    │                │  NO
                               ▼                ▼
            ┌───────────────────────────┐   ┌───────────────────────────┐
            │ Check Equipment Inventory │   │   Keep Load the Same.     │
            │ for next symmetrical plate│   │   Aim for +1 rep next     │
            │ increment (+1kg to +2kg). │   │   session with controlled │
            └─────────────┬─────────────┘   │   2-second negative.      │
                          │                 └───────────────────────────┘
            ┌─────────────┴─────────────┐
            │                           │
    Increment <= 2.5 kg         Increment Too Large / None
            │                           │
            ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ Suggest Weight Increase:  │   │ Micro-Progression Advice: │
│ Add plates, reset reps to │   │ Hold load, add 1-2 reps or│
│ lower bound (8 reps).     │   │ add 2-sec pause at bottom.│
└───────────────────────────┘   └───────────────────────────┘
```

### Fatigue & Deload Detection
If the user misses the minimum rep target (e.g. $<8$ reps) across **2 consecutive sessions**, the engine flags accumulated fatigue:
- Recommends reducing weight by 2 kg or performing 1 set this week to allow connective tissue recovery.
- Never increases load when fatigue or low reserve is detected.

---

## 5. Running Module & Guided Run Timer (`GuidedRunModal.tsx` & `RunView.tsx`)

### Structured Sessions
1. **Easy / Zone 2 Run**: 30 min conversational aerobic base building.
2. **Recovery Run**: 20 min gentle shakeout.
3. **Long Aerobic Run**: 45 min continuous steady aerobic volume.
4. **Interval Workout**: 5 cycles of $(2\text{ min work} + 90\text{ sec walk/jog recovery})$.
5. **Tempo Run**: 15 min comfortably hard threshold block.
6. **Strides Session**: 4 relaxed 20-second accelerations for cadence and arm drive.

### The Guided Phased Run Timer
The run timer progresses through 3 automated phases:
1. **Dynamic Pre-Run Warm-Up**: Guided checklist (ankle rocks, leg swings, walking lunges, marching/skips, pace build).
2. **Main Running Blocks**: Live countdown with work/rest intervals and target pace descriptions.
3. **Post-Run Cool-Down**: Walking breathing settle, calf stretch, quad stretch, hip flexor stretch, hamstring mobility.
4. **Manual Post-Run Entry**: Prompts for distance (km), duration, pace (min/km), heart rate (bpm), and tendon sensations.

---

## 6. Optional Plyometrics & Tendon Gate (`PlyometricsModal.tsx`)

High-impact jumping drills build running power but risk Achilles and shin issues if introduced too quickly.

### 1. The Pre-Impact Pain Gate
Before any jumping exercises are displayed, the user must pass the safety check:
> *"Do you currently feel any pain in your feet, ankles, Achilles tendons, shins, or knees?"*
- If **Yes**: Jumping drills are strictly locked. Gentle ankle mobility and seated calf raises are prescribed instead.
- If **No**: The user is cleared to train.

### 2. Three Progressive Stages
- **Stage 1 (Preparation — Non-Jumping)**: High-heel calf raises with 2-second hold, high knee marching, ankle mobility rocks, single-leg balance.
- **Stage 2 (Introductory Impact)**: Ankle pogo hops, two-foot line hops, rhythmic skipping.
- **Stage 3 (Progression)**: Single-leg pogo hops, low-volume short bounds.

Ground contacts are tracked and capped at **1 brief session per week**.

---

## 7. Weekly Schedule & Collision Guardrail (`scheduleChecker.ts`)

The app includes an intelligent collision detector:
- **48-Hour Recovery Guardrail**: Checks if Lower-Body Strength is scheduled immediately before the Sunday Long Run.
- If a conflict occurs, a warning banner appears on the **Today** and **Settings** screens explaining that heavy leg training requires $\sim 48$ hours of recovery before high-volume running, offering alternative schedule options.

---

## 8. Native Android APK Architecture (Capacitor 7 + Gradle)

Kinetic can run as both a Web PWA and a **100% native Android application**.

### Build Pipeline:
1. **Vite Build**: Compiles TypeScript, React 19, and CSS into static web assets in `dist/`.
2. **Capacitor Sync (`npx cap sync android`)**: Copies web assets to `android/app/src/main/assets/public` and configures Android plugins.
3. **Gradle Compilation (`./gradlew assembleDebug`)**:
   - Compiles Java/Kotlin bridge code (`MainActivity.java`).
   - Links Android SDK 35/36 (`androidx.core`, `androidx.activity`, `androidx.webkit`).
   - Packages and signs the debug APK:
     - Root binary: `kinetic-strength-running-coach.apk` (4.1 MB)
     - Android build output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 9. File & Directory Reference

```
My Workout app/
├── kinetic-strength-running-coach.apk   # Ready-to-install native Android APK
├── capacitor.config.ts                  # Capacitor native Android configuration
├── android/                             # Android Studio native project & Gradle wrapper
│   ├── app/build.gradle                 # Android app build settings (SDK 36, namespace)
│   └── variables.gradle                 # SDK & AndroidX dependency versions
├── docs/media/                          # Screenshots & animated demo GIF
│   ├── demo.gif                         # Mobile animated walkthrough
│   ├── mobile-today.png                 # Today view screenshot
│   ├── mobile-readiness.png             # Readiness check modal
│   ├── mobile-active-workout.png        # Active workout with vector diagram
│   ├── mobile-rest-timer.png            # Floating rest interval timer
│   └── mobile-strength.png              # Strength plans & accordion
├── src/
│   ├── types/                           # TypeScript domain models
│   │   ├── workout.ts                   # Exercises, sets, active workout state
│   │   ├── running.ts                   # Running templates, intervals, phases
│   │   ├── plyometrics.ts               # Stages 1-3, drills, safety checks
│   │   ├── equipment.ts                 # Handles, plate inventories, combinations
│   │   └── user.ts                      # User profile, schedule, settings, PRs
│   ├── db/
│   │   ├── storage.ts                   # LocalStorage persistence & JSON export/import
│   │   ├── initialData.ts               # Seed data (Upper A, Lower, Upper B, runs)
│   │   └── exerciseLibrary.ts           # Exercise catalog with cues & substitutions
│   ├── services/
│   │   ├── progressionEngine.ts         # Double-progression & deload algorithms
│   │   ├── equipmentService.ts          # Symmetrical plate math & breakdown helper
│   │   ├── scheduleChecker.ts           # 48h recovery collision detector
│   │   ├── audioService.ts              # Web Audio API harmonic chimes
│   │   └── vibrationService.ts          # Haptic feedback integration
│   ├── hooks/
│   │   ├── useWorkoutTimer.ts           # Absolute epoch timestamp drift-proof timer
│   │   └── useActiveWorkout.ts          # Complete session lifecycle management
│   ├── components/
│   │   ├── layout/                      # Header and BottomNavigation
│   │   ├── today/                       # Today view and Readiness check modal
│   │   ├── strength/                    # Strength plans and WorkoutEditorModal
│   │   ├── activeWorkout/               # Full-screen active workout mode
│   │   ├── run/                         # RunView and GuidedRunModal
│   │   ├── plyometrics/                 # PlyometricsModal with tendon safety gate
│   │   ├── progress/                    # SVG charts, PR board, volume tracking
│   │   ├── settings/                    # Plate inventory, schedule editor, theme, backup
│   │   └── common/                      # Swiss SVG exercise line diagrams
│   ├── App.tsx                          # Root coordinator
│   └── index.css                        # Swiss modernist design tokens & 8-pt grid
└── README.md                            # GitHub repository documentation
```
