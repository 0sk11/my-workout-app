import React from 'react';

interface Props {
  illustrationKey: string;
  name: string;
  className?: string;
}

export const ExerciseIllustration: React.FC<Props> = ({ illustrationKey, name, className = '' }) => {
  return (
    <div className={`exercise-illustration-container ${className}`}>
      <svg
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label={`Illustration of ${name}`}
      >
        {/* Background Subtle Grid (Swiss Graph Paper aesthetic) */}
        <defs>
          <pattern id="swiss-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="240" height="140" fill="url(#swiss-grid)" />

        {/* Floor reference line */}
        <line x1="20" y1="115" x2="220" y2="115" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4" />

        {renderIllustrationContent(illustrationKey)}
      </svg>
    </div>
  );
};

function renderIllustrationContent(key: string) {
  switch (key) {
    case 'floor_press':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Mat */}
          <line x1="40" y1="115" x2="200" y2="115" stroke="var(--accent)" strokeWidth="3" />
          {/* Torso lying on mat */}
          <line x1="60" y1="112" x2="135" y2="112" />
          {/* Head */}
          <circle cx="50" cy="110" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Bent knees and planted feet */}
          <polyline points="135,112 165,85 180,115" />
          {/* Upper arm on floor / pressed up */}
          <polyline points="95,112 110,65 110,45" />
          {/* Dumbbell bar & plates */}
          <line x1="98" y1="45" x2="122" y2="45" strokeWidth="3.5" />
          <rect x="96" y="38" width="5" height="14" fill="var(--accent)" stroke="none" />
          <rect x="119" y="38" width="5" height="14" fill="var(--accent)" stroke="none" />
          {/* Motion arrow */}
          <path d="M130 65 L130 45 M126 50 L130 44 L134 50" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">ELBOWS 45° TO TORSO</text>
        </g>
      );

    case 'bent_over_row':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Feet */}
          <line x1="85" y1="115" x2="105" y2="115" />
          {/* Legs with soft knee bend */}
          <polyline points="95,115 105,80 120,65" />
          {/* Torso hinged at 45 deg */}
          <line x1="120" y1="65" x2="165" y2="45" />
          {/* Head */}
          <circle cx="175" cy="40" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Arm pulling dumbbell to hip */}
          <polyline points="150,52 140,40 145,62" />
          {/* Dumbbell */}
          <line x1="135" y1="62" x2="155" y2="62" strokeWidth="3.5" />
          <rect x="133" y="56" width="4" height="12" fill="var(--accent)" stroke="none" />
          <rect x="153" y="56" width="4" height="12" fill="var(--accent)" stroke="none" />
          {/* Pull direction arrow */}
          <path d="M140 78 L140 58 M136 64 L140 58 L144 64" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">PULL ELBOW TO HIP • FLAT SPINE</text>
        </g>
      );

    case 'pull_up':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Pull up bar overhead */}
          <line x1="50" y1="25" x2="190" y2="25" stroke="currentColor" strokeWidth="4" />
          {/* Hands holding bar */}
          <circle cx="100" cy="25" r="3" fill="var(--accent)" />
          <circle cx="140" cy="25" r="3" fill="var(--accent)" />
          {/* Arms pulling */}
          <line x1="100" y1="25" x2="110" y2="45" />
          <line x1="140" y1="25" x2="130" y2="45" />
          {/* Head above or at bar */}
          <circle cx="120" cy="38" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Torso */}
          <line x1="120" y1="46" x2="120" y2="85" />
          {/* Resistance band loop */}
          <path d="M120 25 C105 50 105 85 120 100 C135 85 135 50 120 25" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Legs in band */}
          <line x1="120" y1="85" x2="120" y2="102" />
          <line x1="120" y1="102" x2="126" y2="104" />
          {/* Upward motion arrow */}
          <path d="M80 65 L80 40 M76 46 L80 40 L84 46" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="128" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">BAND ASSISTANCE • CONTROLLED NEGATIVE</text>
        </g>
      );

    case 'biceps_curl':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Feet */}
          <line x1="105" y1="115" x2="135" y2="115" />
          {/* Legs */}
          <line x1="115" y1="115" x2="115" y2="75" />
          <line x1="125" y1="115" x2="125" y2="75" />
          {/* Torso */}
          <line x1="120" y1="75" x2="120" y2="42" />
          {/* Head */}
          <circle cx="120" cy="32" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Left arm relaxed at side */}
          <polyline points="112,45 106,65 106,85" />
          {/* Right arm curling up */}
          <polyline points="128,45 130,68 142,50" />
          {/* Dumbbell */}
          <line x1="135" y1="48" x2="149" y2="48" strokeWidth="3.5" />
          <rect x="133" y="42" width="4" height="12" fill="var(--accent)" stroke="none" />
          <rect x="147" y="42" width="4" height="12" fill="var(--accent)" stroke="none" />
          {/* Curl arc arrow */}
          <path d="M148 78 A18 18 0 0 0 144 55" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          <text x="120" y="20" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">ELBOW PINNED TO RIBS • NO SWING</text>
        </g>
      );

    case 'goblet_squat':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Feet wide */}
          <line x1="85" y1="115" x2="155" y2="115" />
          {/* Deep squat legs: feet -> knees forward/out -> hips down */}
          <polyline points="95,115 88,85 110,88 120,88 142,88 152,85 145,115" />
          {/* Upright torso */}
          <line x1="120" y1="88" x2="120" y2="52" />
          {/* Head */}
          <circle cx="120" cy="42" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Arms cupping dumbbell at collarbone */}
          <polyline points="115,55 112,65 120,62 128,65 125,55" />
          {/* Vertical dumbbell */}
          <rect x="117" y="58" width="6" height="18" fill="currentColor" stroke="none" />
          <rect x="113" y="56" width="14" height="4" fill="var(--accent)" stroke="none" />
          <rect x="113" y="74" width="14" height="4" fill="var(--accent)" stroke="none" />
          {/* Drive arrow up */}
          <path d="M120 108 L120 95 M116 100 L120 94 L124 100" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">CHEST UP • KNEES TRACK OVER TOES</text>
        </g>
      );

    case 'rdl':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Feet */}
          <line x1="135" y1="115" x2="155" y2="115" />
          {/* Lower leg upright / slight knee angle */}
          <line x1="145" y1="115" x2="148" y2="82" />
          {/* Thigh pushing back to hips */}
          <line x1="148" y1="82" x2="165" y2="65" />
          {/* Flat spine hinged forward */}
          <line x1="165" y1="65" x2="115" y2="60" />
          {/* Head in neutral alignment */}
          <circle cx="105" cy="58" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Arms hanging dumbbells down shins */}
          <line x1="125" y1="62" x2="135" y2="92" />
          {/* Dumbbells */}
          <line x1="128" y1="92" x2="142" y2="92" strokeWidth="3.5" />
          <rect x="126" y="86" width="4" height="12" fill="var(--accent)" stroke="none" />
          <rect x="140" y="86" width="4" height="12" fill="var(--accent)" stroke="none" />
          {/* Hip hinge arrow pushing back */}
          <path d="M160 55 L175 60 M170 54 L176 60 L171 65" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">PUSH HIPS BACK • SOFT KNEES • FLAT SPINE</text>
        </g>
      );

    case 'glute_bridge':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Floor & Mat */}
          <line x1="30" y1="115" x2="210" y2="115" stroke="var(--accent)" strokeWidth="2" />
          {/* Head & upper back on floor */}
          <circle cx="50" cy="110" r="8" fill="currentColor" fillOpacity="0.15" />
          <line x1="58" y1="112" x2="80" y2="112" />
          {/* Elevated diagonal line (back to hips) */}
          <line x1="80" y1="112" x2="135" y2="78" strokeWidth="3" />
          {/* Knees bent to planted heels */}
          <polyline points="135,78 155,78 170,115" />
          {/* Squeeze arrow upward at hips */}
          <path d="M135 98 L135 80 M131 86 L135 80 L139 86" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="32" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">DRIVE THROUGH HEELS • SQUEEZE GLUTES</text>
        </g>
      );

    case 'calf_raises':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Wall / support */}
          <line x1="165" y1="30" x2="165" y2="115" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          {/* High heels raised off floor */}
          <line x1="105" y1="115" x2="115" y2="115" />
          <line x1="115" y1="115" x2="118" y2="105" stroke="var(--accent)" strokeWidth="3" />
          <polyline points="118,105 120,70 120,42" />
          {/* Head */}
          <circle cx="120" cy="32" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Hand lightly touching wall */}
          <line x1="120" y1="50" x2="165" y2="60" strokeDasharray="3 3" />
          {/* Upward arrow */}
          <path d="M95 105 L95 80 M91 86 L95 80 L99 86" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="18" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">HIGH ON BALL OF FOOT • 2-SEC HOLD</text>
        </g>
      );

    case 'dead_bug':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Mat */}
          <line x1="40" y1="115" x2="200" y2="115" stroke="var(--accent)" strokeWidth="2" />
          {/* Torso flat on back */}
          <line x1="70" y1="112" x2="140" y2="112" strokeWidth="3" />
          <circle cx="60" cy="110" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Tabletop knee */}
          <polyline points="140,112 140,82 165,82" />
          {/* Extended leg hovering */}
          <polyline points="140,112 185,100" strokeDasharray="4 2" />
          {/* Extended arm overhead */}
          <line x1="90" y1="112" x2="55" y2="95" strokeDasharray="4 2" />
          {/* Vertical arm */}
          <line x1="90" y1="112" x2="90" y2="65" />
          <text x="120" y="32" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">LOWER BACK PINNED FLAT • DIAGONAL REACH</text>
        </g>
      );

    case 'push_up':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Sturdy incline surface (table/sofa) */}
          <rect x="175" y="70" width="35" height="45" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
          {/* Hands on edge */}
          <circle cx="175" cy="70" r="3" fill="var(--accent)" />
          {/* Body in rigid straight plank line */}
          <line x1="65" y1="115" x2="175" y2="70" strokeWidth="3" />
          <circle cx="185" cy="65" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Arms pressing */}
          <polyline points="160,76 168,60 175,70" />
          {/* Down-up press motion */}
          <path d="M150 90 L158 80 M153 82 L158 80 L160 85" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">RIGID PLANK POSTURE • ELBOWS 45°</text>
        </g>
      );

    case 'band_row':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Seated upright on floor */}
          <line x1="60" y1="112" x2="140" y2="112" />
          <line x1="90" y1="112" x2="90" y2="60" strokeWidth="3" />
          <circle cx="90" cy="50" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Legs extended with band around feet */}
          <line x1="90" y1="112" x2="165" y2="112" />
          <line x1="165" y1="112" x2="165" y2="100" />
          {/* Band */}
          <path d="M165 104 C140 95 125 90 105 82" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Arms pulling elbows back */}
          <polyline points="90,68 112,78 105,82" />
          <text x="120" y="24" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">TALL CHEST • PINCH SHOULDER BLADES</text>
        </g>
      );

    case 'lateral_raise':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Standing on band */}
          <line x1="110" y1="115" x2="130" y2="115" stroke="var(--accent)" strokeWidth="3" />
          {/* Torso */}
          <line x1="120" y1="115" x2="120" y2="45" />
          <circle cx="120" cy="35" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Arms raised in scapular plane */}
          <polyline points="75,55 95,50 120,48 145,50 165,55" strokeWidth="2.5" />
          {/* Band lines from foot to hands */}
          <line x1="120" y1="115" x2="75" y2="55" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="120" y1="115" x2="165" y2="55" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="120" y="20" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">OPTIONAL • LIGHT LOAD • 30° SCAPULAR PLANE</text>
        </g>
      );

    case 'triceps_pushdown':
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Overhead Anchor */}
          <line x1="100" y1="20" x2="150" y2="20" stroke="currentColor" strokeWidth="3" />
          {/* Band hanging from anchor */}
          <line x1="125" y1="20" x2="125" y2="60" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Torso slightly angled */}
          <line x1="105" y1="115" x2="115" y2="75" />
          <line x1="115" y1="75" x2="115" y2="45" />
          <circle cx="115" cy="35" r="8" fill="currentColor" fillOpacity="0.15" />
          {/* Upper arm pinned at side, forearm pushing down */}
          <polyline points="115,50 120,68 120,95" strokeWidth="3" />
          {/* Downward arrow */}
          <path d="M130 75 L130 95 M126 89 L130 95 L134 89" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="120" y="130" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" letterSpacing="0.5" stroke="none">ELBOWS PINNED AT SIDES • SQUEEZE TRICEPS</text>
        </g>
      );

    default:
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="120" cy="50" r="14" fill="currentColor" fillOpacity="0.1" />
          <line x1="120" y1="64" x2="120" y2="105" />
          <line x1="120" y1="105" x2="100" y2="115" />
          <line x1="120" y1="105" x2="140" y2="115" />
          <line x1="120" y1="75" x2="95" y2="85" />
          <line x1="120" y1="75" x2="145" y2="85" />
          <text x="120" y="25" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" stroke="none">CONTROLLED MOVEMENT</text>
        </g>
      );
  }
}
