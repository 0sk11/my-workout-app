# Kinetic — Personal Strength & Running Coach

> A mobile-first fitness application designed as a personal strength-training and running companion. Designed with a minimalist, mathematically structured aesthetic inspired by Swiss modernist design and Max Bill.

[![Android](https://img.shields.io/badge/Platform-Android%20%7C%20PWA-green.svg)](#native-android-apk)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Capacitor-blue.svg)](#tech-stack)
[![Design](https://img.shields.io/badge/Design-Swiss%20Modernist%20%7C%208--pt%20Grid-red.svg)](#design-principles)

---

## 📱 Native Android APK

The pre-compiled native Android APK is ready in the repository:
- **`kinetic-strength-running-coach.apk`** (4.1 MB)
- Generated via Android SDK & Gradle: `android/app/build/outputs/apk/debug/app-debug.apk`

### Quick Install on Android:
```bash
adb install -r ./kinetic-strength-running-coach.apk
```
*Or copy the `.apk` file directly to your phone and open it to install.*

---

## 🚀 Key Features

1. **Central Workout Experience**:
   - **Vector SVG Movement Line Diagrams**: Form cues, joint angles (e.g. elbows 45° to torso), and targeted muscle highlights.
   - **Dumbbell Plate Breakdown Calculator**: Automatically calculates exact plate setup per handle based on your available inventory (e.g. *2 kg handle + 2 × 2 kg plates = 6 kg*).
   - **Drift-Proof Rest Timer**: Uses absolute timestamps (`Date.now() + sec * 1000`) so screen locking or app switching never drifts the timer. Includes +15s/+30s extensions and Web Audio synthesized chimes.
   - **In-Workout Adaptation**: Exercise substitutions, optional skipping (e.g., shoulder fatigue guardrail), and set logging with Reps in Reserve (RIR).
   - **Full Crash/Refresh Recovery**: Active workout auto-saves locally and recovers seamlessly.

2. **Conservative Double-Progression Engine**:
   - Focuses on 2–3 reps in reserve (RIR). Never encourages failure training.
   - Adds repetitions across sessions before recommending load increases.
   - Ensures weight suggestions match actual symmetrical plate increments.
   - Fatigue detection and volume reduction suggestions for consecutive missed targets.

3. **Running Section & Guided Run Timer**:
   - Pre-configured sessions: **Zone 2 Easy Runs**, **Recovery Runs**, **Long Aerobic Runs**, **Intervals (5 × 2 min)**, **Tempo Runs**, and **Strides**.
   - Phased guided timer: Dynamic Warm-up $\to$ Main Run / Intervals $\to$ Cool-down Routine.
   - Manual post-run logger (distance, duration, pace, heart rate, RPE, tendon notes).

4. **Optional Plyometrics Module**:
   - **Tendon Pain Gate Screening**: Blocks impact jumping exercises if any lower-limb or Achilles ache is reported, recommending gentle mobility alternatives.
   - 3 progressive stages tracking ground contacts.

5. **Weekly Schedule & Smart Guardrails**:
   - Default schedule: Upper A, Easy Run, Lower-Body Strength, Intervals, Upper B, Rest, Long Run.
   - **48-Hour Recovery Conflict Warning**: Warns if heavy leg training is scheduled immediately before the long endurance run.

6. **Local Persistence & Data Ownership**:
   - 100% offline capable.
   - Full JSON export and import with schema validation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Mobile Container**: Capacitor 7 (Android native bridge)
- **Styling**: Swiss Modernist Vanilla CSS (8-point spatial grid, tabular typography, dark/light modes)
- **Icons**: Lucide Icons
- **Audio**: Web Audio API (zero external asset dependencies)

---

## 💻 Development & Building

### Install Dependencies:
```bash
npm install
```

### Run Web Development Server:
```bash
npm run dev
```

### Build Production Web Assets:
```bash
npm run build
```

### Compile Native Android APK:
```bash
npx cap sync android
cd android && ./gradlew assembleDebug
```
Output APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
