import { EquipmentInventory, PlateCombination } from '../types/equipment';

export const EquipmentService = {
  /**
   * Computes all possible symmetrical weight configurations for either a pair of dumbbells
   * or a single dumbbell (e.g. for Goblet Squats).
   */
  getAvailableDumbbellWeights(
    equipment: EquipmentInventory,
    isSingleDumbbell: boolean = false
  ): PlateCombination[] {
    const handleWeight = equipment.dumbbellHandleWeightKg;
    const combinations: PlateCombination[] = [];

    // Identify plate groups
    // If pair of dumbbells: plates are divided by 2 (and each dumbbell must have equal pairs of plates on both sides)
    // Symmetrical loading on 1 dumbbell means plates must be added in pairs of 2 (1 plate on each end of the handle).
    // So for a pair of dumbbells, each dumbbell needs 2 identical plates, so we need multiples of 4 identical plates across both dumbbells.
    const plateCounts: Record<number, number> = {};
    equipment.plates.forEach(p => {
      plateCounts[p.weightKg] = p.count;
    });

    const uniqueWeights = Object.keys(plateCounts)
      .map(Number)
      .sort((a, b) => a - b);

    // Max pairs of each plate weight available for ONE dumbbell:
    // If isSingleDumbbell: available pairs = Math.floor(count / 2)
    // If pair of dumbbells: available pairs = Math.floor(count / 4)
    const divisor = isSingleDumbbell ? 2 : 4;
    const maxPairsPerWeight: Record<number, number> = {};
    uniqueWeights.forEach(w => {
      maxPairsPerWeight[w] = Math.floor((plateCounts[w] || 0) / divisor);
    });

    // Helper recursion to generate all combination of pairs
    function generate(
      index: number,
      currentPlates: { weightKg: number; count: number }[],
      currentWeight: number
    ) {
      if (index === uniqueWeights.length) {
        // Build description
        let desc = `${handleWeight} kg handle`;
        if (currentPlates.length > 0) {
          const plateDetails = currentPlates.map(
            p => `${p.count} × ${p.weightKg} kg (${p.count / 2} per side)`
          );
          desc += ` + ${plateDetails.join(' + ')}`;
        }
        combinations.push({
          totalDumbbellWeightKg: currentWeight,
          platesPerDumbbell: [...currentPlates],
          isSingleDumbbellOnly: isSingleDumbbell,
          description: desc
        });
        return;
      }

      const weight = uniqueWeights[index];
      const maxPairs = maxPairsPerWeight[weight] || 0;

      for (let pairs = 0; pairs <= maxPairs; pairs++) {
        const platesCount = pairs * 2;
        const addedWeight = platesCount * weight;
        const nextPlates = [...currentPlates];
        if (platesCount > 0) {
          nextPlates.push({ weightKg: weight, count: platesCount });
        }
        generate(index + 1, nextPlates, currentWeight + addedWeight);
      }
    }

    generate(0, [], handleWeight);

    // Sort by total weight ascending and remove duplicates
    const seen = new Set<number>();
    const sorted: PlateCombination[] = [];
    combinations.sort((a, b) => a.totalDumbbellWeightKg - b.totalDumbbellWeightKg);

    for (const combo of combinations) {
      if (!seen.has(combo.totalDumbbellWeightKg)) {
        seen.add(combo.totalDumbbellWeightKg);
        sorted.push(combo);
      }
    }

    return sorted;
  },

  /**
   * Find the plate breakdown description for a target weight
   */
  getPlateBreakdown(
    targetWeightKg: number,
    equipment: EquipmentInventory,
    isSingleDumbbell: boolean = false
  ): string {
    const combos = this.getAvailableDumbbellWeights(equipment, isSingleDumbbell);
    const match = combos.find(c => Math.abs(c.totalDumbbellWeightKg - targetWeightKg) < 0.1);
    if (match) return match.description;

    return `${targetWeightKg} kg (Adjust plates symmetrically: handle ${equipment.dumbbellHandleWeightKg} kg + plates)`;
  },

  /**
   * Returns the next available weight above current load
   */
  getNextAvailableWeight(
    currentWeightKg: number,
    equipment: EquipmentInventory,
    isSingleDumbbell: boolean = false
  ): number | null {
    const combos = this.getAvailableDumbbellWeights(equipment, isSingleDumbbell);
    const higher = combos.filter(c => c.totalDumbbellWeightKg > currentWeightKg + 0.1);
    return higher.length > 0 ? higher[0].totalDumbbellWeightKg : null;
  }
};
