export type PlyometricStage = 1 | 2 | 3;

export interface PlyometricDrill {
  id: string;
  name: string;
  stage: PlyometricStage;
  targetContacts: number; // ground contacts per set
  sets: number;
  restSeconds: number;
  description: string;
  cues: string[];
  safeAlternative: string;
  isJumping: boolean;
}

export interface PlyometricSafetyCheck {
  hasFootPain: boolean;
  hasAnklePain: boolean;
  hasAchillesPain: boolean;
  hasKneePain: boolean;
  hasShinPain: boolean;
  checkedAt: string;
  isCleared: boolean;
}

export interface PlyometricSessionLog {
  id: string;
  date: string;
  stage: PlyometricStage;
  totalContacts: number;
  drillsCompleted: {
    drillId: string;
    name: string;
    setsCompleted: number;
    contactsPerSet: number;
  }[];
  perceivedEffort: number; // 1-10
  toleratedWell: boolean;
  notes?: string;
}
