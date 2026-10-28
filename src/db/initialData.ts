import { WorkoutTemplate } from '../types/workout';
import { RunningWorkoutTemplate, WarmupExercise, CooldownExercise } from '../types/running';
import { PlyometricDrill } from '../types/plyometrics';
import { EquipmentInventory } from '../types/equipment';
import { UserProfile, ScheduledDay, AppSettings } from '../types/user';

export const INITIAL_USER_PROFILE: UserProfile = {
  trainingLevel: 'beginner',
  primaryGoal: 'Build a balanced, lean, athletic physique',
  secondaryGoal: 'Improve running strength, durability, and performance',
  strengthSessionsPerWeek: 3,
  runningDaysPerWeek: 4,
  sessionDurationMinutes: 30,
  currentPushUpMax: 6,
  currentPullUpBandAssistedReps: 5,
  notes: 'Shoulder and upper-arm fatigue can occur early in workouts. Low volume, controlled tempo, generous rest.'
};

export const INITIAL_EQUIPMENT: EquipmentInventory = {
  dumbbellHandleWeightKg: 2.0,
  dumbbellHandleCount: 2,
  plates: [
    { weightKg: 2.0, count: 4 },
    { weightKg: 3.0, count: 4 }
  ],
  resistanceBands: [
    { id: 'band_light', label: 'Light Band', color: '#facc15', approxResistanceKg: '5–10 kg', minResistanceKg: 5, maxResistanceKg: 10 },
    { id: 'band_med', label: 'Medium Band', color: '#f87171', approxResistanceKg: '10–20 kg', minResistanceKg: 10, maxResistanceKg: 20 },
    { id: 'band_heavy', label: 'Heavy Band', color: '#60a5fa', approxResistanceKg: '20–30 kg', minResistanceKg: 20, maxResistanceKg: 30 }
  ],
  hasPullUpBar: true,
  hasYogaMat: true,
  hasInclineSurface: true
};

export const INITIAL_STRENGTH_WORKOUTS: WorkoutTemplate[] = [
  {
    id: 'upper_a',
    name: 'Upper A — Foundational Strength',
    category: 'upper_a',
    estimatedDurationMinutes: 28,
    targetFocus: 'Horizontal pressing, vertical pulling, upper back stability & arms',
    warmupNotes: [
      '2 minutes arm circles & wrist rotations',
      '8 cat-cows on yoga mat',
      '5 slow wall or incline push-ups to prime chest & shoulders'
    ],
    exercises: [
      {
        exerciseId: 'dumbbell_floor_press',
        sets: 2,
        targetRepRange: { min: 8, max: 10 },
        startingWeightKg: 6.0, // 2kg handle + two 2kg plates (4kg plates per hand) = 6.0kg total per dumbbell
        restSeconds: 105,
        notes: 'Trial 4 kg of plates per hand plus handle. Lower slowly until triceps tap floor.'
      },
      {
        exerciseId: 'bent_over_dumbbell_row',
        sets: 2,
        targetRepRange: { min: 8, max: 12 },
        startingWeightKg: 6.0,
        restSeconds: 90,
        notes: 'Trial 4 kg of plates per hand plus handle. Hinge hips back, brace core.'
      },
      {
        exerciseId: 'band_assisted_pull_ups',
        sets: 2,
        targetRepRange: { min: 3, max: 5 },
        startingWeightKg: 0,
        bandAssistanceLevel: 'Heavy (Blue)',
        restSeconds: 120,
        notes: 'Choose enough assistance to maintain controlled, smooth reps without swinging.'
      },
      {
        exerciseId: 'dumbbell_biceps_curls',
        sets: 1,
        targetRepRange: { min: 8, max: 10 },
        startingWeightKg: 4.0, // handle + plates or lightest setting
        restSeconds: 60,
        notes: 'Use lightest available configuration or substitute band if dumbbell feels heavy.'
      }
    ]
  },
  {
    id: 'lower',
    name: 'Lower — Running Strength',
    category: 'lower',
    estimatedDurationMinutes: 28,
    targetFocus: 'Posterior chain, single-leg control, calf & Achilles tendon resilience',
    warmupNotes: [
      '8 ankle rocks per side',
      '8 leg swings per leg holding support',
      '5 bodyweight glute bridges with 2-second hold'
    ],
    exercises: [
      {
        exerciseId: 'goblet_squat',
        sets: 2,
        targetRepRange: { min: 8, max: 10 },
        startingWeightKg: 6.0, // 1 dumbbell: 2kg handle + two 2kg plates = 6kg
        restSeconds: 90,
        notes: 'Trial 1 dumbbell with 4 kg of plates plus handle. Deep pain-free squat.'
      },
      {
        exerciseId: 'dumbbell_romanian_deadlift',
        sets: 2,
        targetRepRange: { min: 8, max: 10 },
        startingWeightKg: 6.0, // 4kg plates per hand plus handles
        restSeconds: 105,
        notes: 'Trial 4 kg of plates per hand plus handles. Soft knees, push hips straight back.'
      },
      {
        exerciseId: 'glute_bridge',
        sets: 2,
        targetRepRange: { min: 10, max: 12 },
        startingWeightKg: 0,
        restSeconds: 60,
        notes: 'Bodyweight. Drive through heels, 2-second squeeze at top.'
      },
      {
        exerciseId: 'standing_calf_raises',
        sets: 2,
        targetRepRange: { min: 12, max: 15 },
        startingWeightKg: 0,
        restSeconds: 60,
        notes: 'Bodyweight. 2-second hold at peak, 3-second lowering. Vital for running durability.'
      },
      {
        exerciseId: 'dead_bugs',
        sets: 1,
        targetRepRange: { min: 6, max: 6 },
        startingWeightKg: 0,
        restSeconds: 45,
        notes: '6 reps per side. Keep lower back pinned completely flat to mat.'
      }
    ]
  },
  {
    id: 'upper_b',
    name: 'Upper B — Balanced Development',
    category: 'upper_b',
    estimatedDurationMinutes: 28,
    targetFocus: 'Shoulder health, posture balance, horizontal pulling, triceps durability',
    warmupNotes: [
      'Arm sweeps across chest & overhead reaches',
      '10 light band pull-aparts or shoulder dislocates with light band',
      '5 slow bodyweight wall presses'
    ],
    exercises: [
      {
        exerciseId: 'incline_push_ups',
        sets: 2,
        targetRepRange: { min: 6, max: 10 },
        startingWeightKg: 0,
        restSeconds: 90,
        notes: 'Use a stable surface (sturdy sofa or counter). Rigid plank posture.'
      },
      {
        exerciseId: 'resistance_band_row',
        sets: 2,
        targetRepRange: { min: 10, max: 12 },
        startingWeightKg: 0,
        bandAssistanceLevel: 'Medium (Red)',
        restSeconds: 75,
        notes: 'Seated row with band looped on feet. Squeeze shoulder blades together.'
      },
      {
        exerciseId: 'light_band_lateral_raises',
        sets: 1,
        targetRepRange: { min: 10, max: 12 },
        startingWeightKg: 0,
        bandAssistanceLevel: 'Light (Yellow)',
        restSeconds: 60,
        isOptional: true,
        notes: 'OPTIONAL: Very light band. Skip freely if shoulder fatigue occurs.'
      },
      {
        exerciseId: 'dumbbell_biceps_curls',
        sets: 1,
        targetRepRange: { min: 8, max: 12 },
        startingWeightKg: 4.0,
        restSeconds: 60,
        notes: 'Strict form, no torso swinging.'
      },
      {
        exerciseId: 'band_triceps_pushdowns',
        sets: 1,
        targetRepRange: { min: 10, max: 12 },
        startingWeightKg: 0,
        bandAssistanceLevel: 'Medium (Red)',
        restSeconds: 60,
        notes: 'Anchor overhead to pull-up bar. If anchor unavailable, use overhead extension.'
      }
    ]
  }
];

export const STANDARD_RUN_WARMUP: WarmupExercise[] = [
  { id: 'w1', name: 'Brisk Walk or Easy Jog', durationSeconds: 150, cues: '2.5 minutes easy rhythmic movement to elevate core temperature gradually.' },
  { id: 'w2', name: 'Ankle Rocks', repsOrDistance: '8 per side', cues: 'Knee tracking over toes to mobilize calf, ankle and Achilles complex.' },
  { id: 'w3', name: 'Leg Swings (Front/Back & Side)', repsOrDistance: '8 per leg', cues: 'Light support against a wall or tree. Smooth fluid dynamic range of motion.' },
  { id: 'w4', name: 'Walking Lunges or Reverse Lunges', repsOrDistance: '5 per side', cues: 'Gentle step, activate glutes and hip flexors pain-free.' },
  { id: 'w5', name: 'Marching & Easy Skips', durationSeconds: 30, cues: 'Drive knees up rhythmically with light spring in ankles.' },
  { id: 'w6', name: 'Gradual Pace Build', durationSeconds: 60, cues: 'Ease smoothly into your easy running pace without sudden sprinting.' }
];

export const STANDARD_RUN_COOLDOWN: CooldownExercise[] = [
  { id: 'c1', name: 'De-escalation Walk', durationSeconds: 150, cues: 'Slow walk until breathing and heart rate settle comfortably.' },
  { id: 'c2', name: 'Gentle Calf Stretch', durationSeconds: 30, cues: '30 sec per side. Straight back leg, heel down, no bouncing.' },
  { id: 'c3', name: 'Standing Quadriceps Stretch', durationSeconds: 30, cues: '30 sec per leg. Knees touching, gentle tuck of hips.' },
  { id: 'c4', name: 'Hip-Flexor Stretch', durationSeconds: 30, cues: '30 sec per side. Gentle half-kneeling or standing lunge stance.' },
  { id: 'c5', name: 'Hamstring & Lower Back Mobility', durationSeconds: 30, cues: 'Gentle hinge with soft knees in a comfortable, relaxed range.' }
];

export const INITIAL_RUNNING_WORKOUTS: RunningWorkoutTemplate[] = [
  {
    id: 'easy_run',
    title: 'Easy / Zone 2 Run',
    runType: 'easy',
    description: 'Conversational aerobic endurance run. Builds capillary density, mitochondrial efficiency, and running durability without fatigue.',
    targetDurationMinutes: 30,
    perceivedEffortTarget: 'RPE 3–4 (Full sentences breathing)',
    warmupRoutine: STANDARD_RUN_WARMUP,
    mainBlocks: [
      { id: 'mb_easy', name: 'Easy Aerobic Pace', type: 'work', durationSeconds: 1800, targetPaceDescription: 'Conversational Zone 2', targetHrZone: 'Zone 2' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  },
  {
    id: 'recovery_run',
    title: 'Recovery Run',
    runType: 'recovery',
    description: 'Short, gentle shakeout to promote circulation and active recovery between strength or harder run days.',
    targetDurationMinutes: 20,
    perceivedEffortTarget: 'RPE 2–3 (Very easy, relaxed)',
    warmupRoutine: STANDARD_RUN_WARMUP.slice(0, 3), // Shorter warmup for recovery
    mainBlocks: [
      { id: 'mb_rec', name: 'Gentle Shakeout Run', type: 'work', durationSeconds: 1200, targetPaceDescription: 'Very light & comfortable', targetHrZone: 'Zone 1–2' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  },
  {
    id: 'long_run',
    title: 'Long Aerobic Run',
    runType: 'long_run',
    description: 'Steady, continuous aerobic base building. Keeps pace conversational and builds mental stamina.',
    targetDurationMinutes: 45,
    perceivedEffortTarget: 'RPE 3–4 (Steady conversational)',
    warmupRoutine: STANDARD_RUN_WARMUP,
    mainBlocks: [
      { id: 'mb_long', name: 'Continuous Aerobic Run', type: 'work', durationSeconds: 2700, targetPaceDescription: 'Consistent easy pace', targetHrZone: 'Zone 2' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  },
  {
    id: 'intervals',
    title: 'Interval Workout (5 × 2 min)',
    runType: 'interval',
    description: 'Structured intervals to develop aerobic capacity (VO2 max) and running economy with controlled recovery intervals.',
    targetDurationMinutes: 32,
    perceivedEffortTarget: 'Work: RPE 7–8 | Rest: RPE 2 walk/jog',
    warmupRoutine: STANDARD_RUN_WARMUP,
    mainBlocks: [
      { id: 'int_w_0', name: 'Pre-Interval Easy Jog', type: 'warmup', durationSeconds: 300, targetPaceDescription: 'Easy jog', targetHrZone: 'Zone 2' },
      { id: 'int_1_w', name: 'Interval 1 — Hard', type: 'work', durationSeconds: 120, targetPaceDescription: '5K effort / brisk', targetHrZone: 'Zone 4' },
      { id: 'int_1_r', name: 'Recovery 1 — Walk / Jog', type: 'recovery', durationSeconds: 90, targetPaceDescription: 'Walk or gentle jog', targetHrZone: 'Zone 1' },
      { id: 'int_2_w', name: 'Interval 2 — Hard', type: 'work', durationSeconds: 120, targetPaceDescription: '5K effort / brisk', targetHrZone: 'Zone 4' },
      { id: 'int_2_r', name: 'Recovery 2 — Walk / Jog', type: 'recovery', durationSeconds: 90, targetPaceDescription: 'Walk or gentle jog', targetHrZone: 'Zone 1' },
      { id: 'int_3_w', name: 'Interval 3 — Hard', type: 'work', durationSeconds: 120, targetPaceDescription: '5K effort / brisk', targetHrZone: 'Zone 4' },
      { id: 'int_3_r', name: 'Recovery 3 — Walk / Jog', type: 'recovery', durationSeconds: 90, targetPaceDescription: 'Walk or gentle jog', targetHrZone: 'Zone 1' },
      { id: 'int_4_w', name: 'Interval 4 — Hard', type: 'work', durationSeconds: 120, targetPaceDescription: '5K effort / brisk', targetHrZone: 'Zone 4' },
      { id: 'int_4_r', name: 'Recovery 4 — Walk / Jog', type: 'recovery', durationSeconds: 90, targetPaceDescription: 'Walk or gentle jog', targetHrZone: 'Zone 1' },
      { id: 'int_5_w', name: 'Interval 5 — Hard', type: 'work', durationSeconds: 120, targetPaceDescription: '5K effort / brisk', targetHrZone: 'Zone 4' },
      { id: 'int_5_r', name: 'Recovery 5 — Walk / Jog', type: 'recovery', durationSeconds: 90, targetPaceDescription: 'Walk or gentle jog', targetHrZone: 'Zone 1' },
      { id: 'int_w_end', name: 'Post-Interval Jog', type: 'cooldown', durationSeconds: 300, targetPaceDescription: 'Very light jog to settle HR', targetHrZone: 'Zone 1–2' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  },
  {
    id: 'tempo_run',
    title: 'Comfortable Tempo Run',
    runType: 'tempo',
    description: 'Sustained, comfortably hard threshold pace that trains lactate clearance without over-fatiguing.',
    targetDurationMinutes: 30,
    perceivedEffortTarget: 'RPE 6 (Comfortably hard, 2–3 word speaking)',
    warmupRoutine: STANDARD_RUN_WARMUP,
    mainBlocks: [
      { id: 'tempo_warm', name: 'Warm-up Jog', type: 'warmup', durationSeconds: 420, targetPaceDescription: 'Gradual build up', targetHrZone: 'Zone 2' },
      { id: 'tempo_main', name: 'Tempo Block', type: 'work', durationSeconds: 900, targetPaceDescription: 'Sustained tempo effort', targetHrZone: 'Zone 3–4' },
      { id: 'tempo_cool', name: 'Cool-down Jog', type: 'cooldown', durationSeconds: 480, targetPaceDescription: 'Gentle recovery jog', targetHrZone: 'Zone 1–2' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  },
  {
    id: 'strides',
    title: 'Easy Run + Strides',
    runType: 'strides',
    description: 'Easy aerobic run followed by 4 relaxed 20-second accelerations focusing on crisp cadence, upright posture, and arm drive.',
    targetDurationMinutes: 30,
    perceivedEffortTarget: 'Run: RPE 3 | Strides: RPE 7–8 (smooth, not maximum sprint)',
    warmupRoutine: STANDARD_RUN_WARMUP,
    mainBlocks: [
      { id: 'str_base', name: 'Easy Aerobic Base', type: 'work', durationSeconds: 1320, targetPaceDescription: 'Zone 2 conversational', targetHrZone: 'Zone 2' },
      { id: 'str_1', name: 'Stride 1 (20s acceleration)', type: 'work', durationSeconds: 20, targetPaceDescription: 'Smooth acceleration to 90%', targetHrZone: 'Zone 4' },
      { id: 'str_r1', name: 'Walk Recovery', type: 'recovery', durationSeconds: 60, targetPaceDescription: 'Full breath recovery', targetHrZone: 'Zone 1' },
      { id: 'str_2', name: 'Stride 2 (20s acceleration)', type: 'work', durationSeconds: 20, targetPaceDescription: 'Smooth acceleration to 90%', targetHrZone: 'Zone 4' },
      { id: 'str_r2', name: 'Walk Recovery', type: 'recovery', durationSeconds: 60, targetPaceDescription: 'Full breath recovery', targetHrZone: 'Zone 1' },
      { id: 'str_3', name: 'Stride 3 (20s acceleration)', type: 'work', durationSeconds: 20, targetPaceDescription: 'Smooth acceleration to 90%', targetHrZone: 'Zone 4' },
      { id: 'str_r3', name: 'Walk Recovery', type: 'recovery', durationSeconds: 60, targetPaceDescription: 'Full breath recovery', targetHrZone: 'Zone 1' },
      { id: 'str_4', name: 'Stride 4 (20s acceleration)', type: 'work', durationSeconds: 20, targetPaceDescription: 'Smooth acceleration to 90%', targetHrZone: 'Zone 4' },
      { id: 'str_r4', name: 'Walk Recovery', type: 'recovery', durationSeconds: 60, targetPaceDescription: 'Full breath recovery', targetHrZone: 'Zone 1' }
    ],
    cooldownRoutine: STANDARD_RUN_COOLDOWN
  }
];

export const INITIAL_PLYOMETRIC_DRILLS: PlyometricDrill[] = [
  // Stage 1: Preparation (Low impact, preparation exercises, not high-intensity)
  {
    id: 'plyo_s1_calf_raise',
    name: 'Controlled High-Heel Calf Raises',
    stage: 1,
    targetContacts: 15,
    sets: 2,
    restSeconds: 60,
    description: 'Prepares the Achilles tendon and gastroc/soleus complex for elastic stiffness.',
    cues: ['Rise high onto big toe knuckle', 'Pause 2 full seconds at peak', 'Lower slowly over 3 seconds'],
    safeAlternative: 'Seated calf raises with hands pressing on knees',
    isJumping: false
  },
  {
    id: 'plyo_s1_marching',
    name: 'Dynamic High Knee Marching',
    stage: 1,
    targetContacts: 20,
    sets: 2,
    restSeconds: 45,
    description: 'Coordinates hip flexors, opposite arm drive, and ankle pre-activation without impact.',
    cues: ['Stand upright, core braced', 'Drive knee to 90° with dorsiflexed foot', 'Land softly on midfoot'],
    safeAlternative: 'Gentle seated high knees',
    isJumping: false
  },
  {
    id: 'plyo_s1_ankle_mobility',
    name: 'Ankle Rock & Mobility Drive',
    stage: 1,
    targetContacts: 10,
    sets: 2,
    restSeconds: 45,
    description: 'Mobilizes ankle dorsiflexion and prepares tendons for kinetic shock absorption.',
    cues: ['Keep heel pinned on floor', 'Drive knee straight over middle toe', 'Hold comfortable end-range stretch 1 sec'],
    safeAlternative: 'Ankle circles on floor',
    isJumping: false
  },
  {
    id: 'plyo_s1_single_balance',
    name: 'Single-Leg Balance Near Wall Support',
    stage: 1,
    targetContacts: 20,
    sets: 2,
    restSeconds: 45,
    description: 'Builds intrinsic foot strength and proprioceptive ankle stability for running.',
    cues: ['Stand on one foot near wall for safety', 'Spread toes wide', 'Hold steady for 20 seconds per side'],
    safeAlternative: 'Tandem stance (heel-to-toe) with both feet on floor',
    isJumping: false
  },

  // Stage 2: Introductory impact (Only when pain-free daily activities and normal running tolerated)
  {
    id: 'plyo_s2_pogo',
    name: 'Gentle Ankle Pogo Hops',
    stage: 2,
    targetContacts: 15,
    sets: 2,
    restSeconds: 90,
    description: 'Low-amplitude, elastic ankle stiffness drill. Knees remain relatively stiff.',
    cues: ['Spring exclusively off ankles and stiff feet', 'Keep contact time very short ("floor is hot")', 'Gentle quiet landing, zero heavy thud'],
    safeAlternative: 'Rapid calf pulses with heels hovering slightly off floor',
    isJumping: true
  },
  {
    id: 'plyo_s2_two_foot_hops',
    name: 'Small Two-Foot Line Hops',
    stage: 2,
    targetContacts: 12,
    sets: 2,
    restSeconds: 90,
    description: 'Forward-and-backward low-amplitude hops over a line or crack on the floor.',
    cues: ['Land on balls of feet with knees soft', 'Maintain rhythmic cadence', 'Stop immediately if feet tire'],
    safeAlternative: 'Fast forward-backward stepping over line',
    isJumping: true
  },
  {
    id: 'plyo_s2_skips',
    name: 'Low-Volume Rhythmic Skipping',
    stage: 2,
    targetContacts: 20,
    sets: 2,
    restSeconds: 90,
    description: 'Develops running coordination, rhythmic timing, and spring mechanics.',
    cues: ['Step-hop rhythm', 'Active arm swing matching legs', 'Soft, silent springy landing'],
    safeAlternative: 'Brisk high marching with arm swings',
    isJumping: true
  },

  // Stage 3: Progression (After several well-tolerated Stage 2 sessions)
  {
    id: 'plyo_s3_single_leg_hops',
    name: 'Low Single-Leg Pogo Hops',
    stage: 3,
    targetContacts: 8,
    sets: 2,
    restSeconds: 90,
    description: 'Single-leg reactive stiffness for advanced running mechanics.',
    cues: ['Hop in place on one foot, low height', 'Keep knee stiff and spring from ankle', '8 reps per leg max'],
    safeAlternative: 'Gentle two-foot pogo hops',
    isJumping: true
  },
  {
    id: 'plyo_s3_bounds',
    name: 'Short Low-Volume Bounds',
    stage: 3,
    targetContacts: 10,
    sets: 2,
    restSeconds: 120,
    description: 'Exaggerated running stride focusing on horizontal flight and hip extension.',
    cues: ['Drive knee forward and push through trail glute', 'Short distance, controlled posture', 'Prioritize landing quality over distance'],
    safeAlternative: 'Exaggerated walking lunges with pause',
    isJumping: true
  }
];

export const INITIAL_SCHEDULE: ScheduledDay[] = [
  { day: 'monday', dayLabel: 'Monday', primaryActivity: 'upper_a' },
  { day: 'tuesday', dayLabel: 'Tuesday', primaryActivity: 'easy_run' },
  { day: 'wednesday', dayLabel: 'Wednesday', primaryActivity: 'lower' },
  { day: 'thursday', dayLabel: 'Thursday', primaryActivity: 'intervals' },
  { day: 'friday', dayLabel: 'Friday', primaryActivity: 'upper_b' },
  { day: 'saturday', dayLabel: 'Saturday', primaryActivity: 'rest', secondaryActivity: 'easy_run' },
  { day: 'sunday', dayLabel: 'Sunday', primaryActivity: 'long_run' }
];

export const INITIAL_SETTINGS: AppSettings = {
  units: 'metric',
  theme: 'system',
  soundEnabled: true,
  vibrationEnabled: true,
  autoStartRestTimer: true,
  transitionCountdownSeconds: 15,
  defaultRestExtensionSeconds: 30,
  speakTimerCues: false
};
