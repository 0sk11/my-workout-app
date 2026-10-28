export interface DumbbellPlateInventory {
  weightKg: number;
  count: number;
}

export interface ResistanceBandItem {
  id: string;
  label: string;
  color: string;
  approxResistanceKg: string; // e.g. "5–10 kg"
  minResistanceKg: number;
  maxResistanceKg: number;
}

export interface EquipmentInventory {
  dumbbellHandleWeightKg: number; // e.g. 1.5 or 2.0 kg
  dumbbellHandleCount: number; // typically 2 handles
  plates: DumbbellPlateInventory[];
  resistanceBands: ResistanceBandItem[];
  hasPullUpBar: boolean;
  hasYogaMat: boolean;
  hasInclineSurface: boolean; // e.g. sturdy sofa/counter/chair
}

export interface PlateCombination {
  totalDumbbellWeightKg: number;
  platesPerDumbbell: { weightKg: number; count: number }[];
  isSingleDumbbellOnly: boolean; // e.g. if loaded symmetrically across 1 dumbbell using all plates
  description: string;
}
