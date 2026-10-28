export const VibrationService = {
  /**
   * Short subtle haptic tap (e.g. set completed)
   */
  tap(): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // Ignored
      }
    }
  },

  /**
   * Rest timer finished pulse pattern
   */
  restFinished(): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([150, 100, 150, 100, 250]);
      } catch {
        // Ignored
      }
    }
  },

  /**
   * Workout completed victory pulse pattern
   */
  workoutFinished(): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {
        // Ignored
      }
    }
  }
};
