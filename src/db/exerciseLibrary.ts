import { ExerciseDefinition } from '../types/workout';

export const EXERCISE_LIBRARY: Record<string, ExerciseDefinition> = {
  dumbbell_floor_press: {
    id: 'dumbbell_floor_press',
    name: 'Dumbbell Floor Press',
    category: 'strength',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: ['dumbbell', 'mat'],
    techniqueCues: [
      'Lie flat on the floor with knees bent and feet planted firmly.',
      'Hold dumbbells with upper arms resting on floor at ~45° to your torso (not flared).',
      'Press upward until arms are straight, keeping wrists aligned above elbows.',
      'Lower slowly under control until triceps lightly touch the floor. Pause momentarily before pressing.',
      'Floor stops excessive shoulder extension, protecting shoulders from impingement.'
    ],
    safetyNotes: 'Never bounce your elbows off the hard floor. Control the descent.',
    defaultRestSeconds: 105,
    defaultRepRange: { min: 8, max: 10 },
    defaultSets: 2,
    substitutions: ['incline_push_ups', 'band_chest_press', 'floor_push_ups'],
    illustrationSvgKey: 'floor_press'
  },
  bent_over_dumbbell_row: {
    id: 'bent_over_dumbbell_row',
    name: 'Bent-Over Dumbbell Row',
    category: 'strength',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['core', 'hamstrings'],
    equipment: ['dumbbell'],
    techniqueCues: [
      'Hinge at hips with soft knees and a neutral, flat spine angled at ~45°.',
      'Hold dumbbells hanging with arms extended under shoulders.',
      'Pull elbows back toward your hips, squeezing shoulder blades together.',
      'Keep neck relaxed and gaze about 1-2 metres in front on the floor.',
      'Lower under control with full stretch without rounding lower back.'
    ],
    safetyNotes: 'Maintain neutral spine throughout. If lower back tires, brace core or place one hand on a sturdy table for support.',
    defaultRestSeconds: 90,
    defaultRepRange: { min: 8, max: 12 },
    defaultSets: 2,
    substitutions: ['resistance_band_row', 'single_arm_supported_row'],
    illustrationSvgKey: 'bent_over_row'
  },
  band_assisted_pull_ups: {
    id: 'band_assisted_pull_ups',
    name: 'Band-Assisted Pull-Ups',
    category: 'bodyweight',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['core', 'shoulders'],
    equipment: ['pull_up_bar', 'resistance_band'],
    techniqueCues: [
      'Loop heavy or medium resistance band securely around the pull-up bar.',
      'Place one foot (or knee) into loop, hang with hands slightly wider than shoulder width.',
      'Depress shoulder blades down away from ears before initiating pull.',
      'Pull chest toward bar until chin clears bar smoothly.',
      'Lower with strict 2-second control to full dead-hang extension.'
    ],
    safetyNotes: 'Ensure band is securely anchored. Keep core tight to prevent swinging.',
    defaultRestSeconds: 120,
    defaultRepRange: { min: 3, max: 5 },
    defaultSets: 2,
    substitutions: ['resistance_band_lat_pulldown', 'resistance_band_row', 'scapular_pull_ups'],
    illustrationSvgKey: 'pull_up'
  },
  dumbbell_biceps_curls: {
    id: 'dumbbell_biceps_curls',
    name: 'Dumbbell Biceps Curls',
    category: 'strength',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    techniqueCues: [
      'Stand tall with feet shoulder-width apart, holding dumbbells at sides.',
      'Lock upper arms pinned beside ribs to prevent swinging.',
      'Curl weights upward, rotating palms facing upward (supinating) at top.',
      'Squeeze biceps at peak for 1 second, then lower under a slow 2-second count.',
      'If dumbbell feels too heavy to maintain strict form, switch to resistance band.'
    ],
    safetyNotes: 'Do not rock your torso backward to generate momentum.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 8, max: 10 },
    defaultSets: 1,
    substitutions: ['band_biceps_curls', 'hammer_curls'],
    illustrationSvgKey: 'biceps_curl'
  },
  goblet_squat: {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    category: 'strength',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    equipment: ['dumbbell'],
    techniqueCues: [
      'Hold a single dumbbell vertically against chest with both hands cupping upper plate.',
      'Set stance slightly wider than shoulder-width, toes turned out 15–30°.',
      'Break at hips and knees simultaneously, sitting down between heels.',
      'Keep chest proud and elbows inside knees at the bottom.',
      'Drive through midfoot and heels to return to standing; squeeze glutes at top.'
    ],
    safetyNotes: 'Descend only as deep as comfortable with neutral lower back. Bodyweight squat is a great regression.',
    defaultRestSeconds: 90,
    defaultRepRange: { min: 8, max: 10 },
    defaultSets: 2,
    substitutions: ['bodyweight_squat', 'band_resisted_squat'],
    illustrationSvgKey: 'goblet_squat'
  },
  dumbbell_romanian_deadlift: {
    id: 'dumbbell_romanian_deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'strength',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'core'],
    equipment: ['dumbbell'],
    techniqueCues: [
      'Stand with feet hip-width apart, dumbbells resting in front of thighs.',
      'Keep knees soft with a slight bend (~15°), maintain this angle throughout.',
      'Push hips backward as if touching a wall behind you with tailbone.',
      'Slide dumbbells close down shins until you feel a deep stretch in hamstrings.',
      'Drive hips forward to stand tall, keeping shoulders packed and lats engaged.'
    ],
    safetyNotes: 'Stop hip travel before back rounds. Keep dumbbells close against legs.',
    defaultRestSeconds: 105,
    defaultRepRange: { min: 8, max: 10 },
    defaultSets: 2,
    substitutions: ['glute_bridge', 'single_leg_bodyweight_rdl', 'band_good_mornings'],
    illustrationSvgKey: 'rdl'
  },
  glute_bridge: {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    category: 'bodyweight',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: ['mat'],
    techniqueCues: [
      'Lie on your back with knees bent at ~90° and feet flat on floor, hip-width apart.',
      'Flatten lower back slightly into floor by engaging core.',
      'Drive through heels and squeeze glutes to lift hips into a straight diagonal line from knees to shoulders.',
      'Pause and hold top contraction for 1–2 seconds.',
      'Lower slowly back to starting position.'
    ],
    safetyNotes: 'Avoid over-arching lower back at peak; drive comes from hips and glutes.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 10, max: 12 },
    defaultSets: 2,
    substitutions: ['single_leg_glute_bridge', 'banded_glute_bridge'],
    illustrationSvgKey: 'glute_bridge'
  },
  standing_calf_raises: {
    id: 'standing_calf_raises',
    name: 'Standing Calf Raises',
    category: 'bodyweight',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    techniqueCues: [
      'Stand tall on flat floor or ball of foot on a step with light fingertip wall support for balance.',
      'Rise high onto balls of both feet, driving straight up through big toes.',
      'Pause at top for 2 seconds to maximize calf and Achilles recruitment.',
      'Lower slowly over 3 seconds to a deep comfortable stretch.',
      'Vital for running durability, tendon stiffness, and shin splint prevention.'
    ],
    safetyNotes: 'Controlled tempo is critical. Avoid bouncy, rapid reps.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 12, max: 15 },
    defaultSets: 2,
    substitutions: ['seated_calf_raises', 'single_leg_calf_raises'],
    illustrationSvgKey: 'calf_raises'
  },
  dead_bugs: {
    id: 'dead_bugs',
    name: 'Dead Bugs',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    equipment: ['mat'],
    techniqueCues: [
      'Lie on back with arms pointing straight up and knees bent at 90° over hips (tabletop).',
      'Press lower back firmly into mat — imagine pinning a dollar bill under your spine.',
      'Slowly lower opposite arm and leg toward floor while maintaining flat lower back.',
      'Hover 2 inches above floor, then return under control.',
      'Alternate sides smoothly; quality and spinal stability matter far more than speed.'
    ],
    safetyNotes: 'If lower back arches off floor, do not reach as far or tap heels down with bent knees.',
    defaultRestSeconds: 45,
    defaultRepRange: { min: 6, max: 6 },
    defaultSets: 1,
    isTimeBased: false,
    substitutions: ['plank', 'bird_dog'],
    illustrationSvgKey: 'dead_bug'
  },
  incline_push_ups: {
    id: 'incline_push_ups',
    name: 'Incline Push-Ups',
    category: 'bodyweight',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'core'],
    equipment: ['incline_surface'],
    techniqueCues: [
      'Place hands slightly wider than shoulder-width on a sturdy elevated surface (sturdy table, sofa edge, counter).',
      'Form a straight rigid plank from heels to crown of head, glutes and abs braced.',
      'Lower chest toward edge with elbows tracking at ~45° angles to torso.',
      'Touch chest lightly to edge, then push through palms back to straight arms.',
      'Higher surface = easier load; lower surface = closer to floor push-up.'
    ],
    safetyNotes: 'Use only sturdy, non-slip surfaces. Regress to wall push-ups if wrists or shoulders feel discomfort.',
    defaultRestSeconds: 90,
    defaultRepRange: { min: 6, max: 10 },
    defaultSets: 2,
    substitutions: ['floor_push_ups', 'knee_push_ups', 'dumbbell_floor_press'],
    illustrationSvgKey: 'push_up'
  },
  resistance_band_row: {
    id: 'resistance_band_row',
    name: 'Resistance-Band Rows',
    category: 'strength',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['shoulders', 'core'],
    equipment: ['resistance_band'],
    techniqueCues: [
      'Sit on floor with legs extended, loop band securely around mid-foot (or around sturdy anchor).',
      'Sit tall with straight spine, shoulders relaxed down.',
      'Pull band handles toward lower ribs, leading with elbows and retracting shoulder blades.',
      'Squeeze mid-back muscles for 1 second at full contraction.',
      'Release under control with 2-second resistance.'
    ],
    safetyNotes: 'Ensure band cannot slip off feet. Keep chest elevated without leaning backward.',
    defaultRestSeconds: 75,
    defaultRepRange: { min: 10, max: 12 },
    defaultSets: 2,
    substitutions: ['bent_over_dumbbell_row', 'single_arm_supported_row'],
    illustrationSvgKey: 'band_row'
  },
  light_band_lateral_raises: {
    id: 'light_band_lateral_raises',
    name: 'Light Band Lateral Raises',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['resistance_band'],
    techniqueCues: [
      'Stand on center of a light resistance band with one foot, holding ends with slight elbow bend.',
      'Raise arms out to sides in scapular plane (~30° forward from direct sides).',
      'Stop at shoulder height — do not shrug neck or raise higher than parallel.',
      'Lower slowly under control.',
      'OPTIONAL DRILL: If shoulder or upper arm fatigue appears, skip this exercise freely without penalty.'
    ],
    safetyNotes: 'Use very light resistance. Skip immediately if any shoulder impingement or ache occurs.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 10, max: 12 },
    defaultSets: 1,
    substitutions: ['band_face_pulls', 'band_pull_aparts'],
    illustrationSvgKey: 'lateral_raise'
  },
  band_triceps_pushdowns: {
    id: 'band_triceps_pushdowns',
    name: 'Band Triceps Pushdowns',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['resistance_band'],
    techniqueCues: [
      'Loop resistance band over high anchor (pull-up bar or secure door anchor).',
      'Grasp band with elbows pinned tightly against sides at 90°.',
      'Extend forearms downward until arms are fully straight, squeezing triceps at bottom.',
      'Allow forearms to rise back to 90° slowly while keeping upper arms motionless.',
      'ALTERNATIVE: If no overhead anchor is available, perform overhead band extensions or dumbbell kickbacks.'
    ],
    safetyNotes: 'Ensure high anchor is 100% secure. Keep wrists neutral.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 10, max: 12 },
    defaultSets: 1,
    substitutions: ['overhead_band_triceps_extension', 'diamond_incline_push_ups'],
    illustrationSvgKey: 'triceps_pushdown'
  },
  floor_push_ups: {
    id: 'floor_push_ups',
    name: 'Floor Push-Ups',
    category: 'bodyweight',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['core', 'shoulders'],
    equipment: ['mat'],
    techniqueCues: [
      'Set hands just outside shoulder width with fingers splayed.',
      'Maintain strong straight body line: glutes tight, quads locked, abs braced.',
      'Lower chest to 2 inches off floor with elbows back at 45°.',
      'Push floor away with full lockout at top.'
    ],
    safetyNotes: 'Do not allow lower back to sag.',
    defaultRestSeconds: 90,
    defaultRepRange: { min: 4, max: 8 },
    defaultSets: 2,
    substitutions: ['incline_push_ups', 'dumbbell_floor_press'],
    illustrationSvgKey: 'push_up'
  },
  overhead_band_triceps_extension: {
    id: 'overhead_band_triceps_extension',
    name: 'Overhead Band Triceps Extension',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['resistance_band'],
    techniqueCues: [
      'Stand on one end of light band, bring other end overhead behind neck.',
      'Keep upper arms close to ears and elbows pointing forward.',
      'Extend arms straight overhead squeezing triceps, then lower with control.'
    ],
    safetyNotes: 'Keep ribs pulled down and spine neutral.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 10, max: 12 },
    defaultSets: 1,
    substitutions: ['band_triceps_pushdowns'],
    illustrationSvgKey: 'triceps_pushdown'
  },
  bodyweight_squat: {
    id: 'bodyweight_squat',
    name: 'Air Squat (Bodyweight)',
    category: 'bodyweight',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves', 'core'],
    equipment: ['bodyweight'],
    techniqueCues: [
      'Stand with feet shoulder-width apart, arms reached forward for counterbalance.',
      'Descend smoothly until thighs are parallel to ground.',
      'Press through full foot to stand tall.'
    ],
    safetyNotes: 'Keep knees tracking over middle toes.',
    defaultRestSeconds: 60,
    defaultRepRange: { min: 10, max: 15 },
    defaultSets: 2,
    substitutions: ['goblet_squat'],
    illustrationSvgKey: 'goblet_squat'
  }
};
