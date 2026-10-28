import { ScheduledDay, ScheduleConflictWarning } from '../types/user';

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const ScheduleChecker = {
  /**
   * Analyzes the weekly schedule for training conflicts, particularly
   * ensuring 48h spacing between lower-body training and long runs.
   */
  checkConflicts(schedule: ScheduledDay[]): ScheduleConflictWarning[] {
    const warnings: ScheduleConflictWarning[] = [];

    const getDayIndex = (day: string) => DAY_ORDER.indexOf(day);

    const lowerDay = schedule.find(
      s => s.primaryActivity === 'lower' || s.secondaryActivity === 'lower'
    );
    const longRunDay = schedule.find(
      s => s.primaryActivity === 'long_run' || s.secondaryActivity === 'long_run'
    );
    const plyoDay = schedule.find(
      s => s.primaryActivity === 'plyometrics' || s.secondaryActivity === 'plyometrics'
    );
    const intervalDay = schedule.find(
      s => s.primaryActivity === 'intervals' || s.secondaryActivity === 'intervals'
    );

    // 1. Lower body strength vs Long run conflict
    if (lowerDay && longRunDay) {
      const lowerIdx = getDayIndex(lowerDay.day);
      const longRunIdx = getDayIndex(longRunDay.day);

      // Distance in days (circular across the 7-day week)
      const dayDiffForward = (longRunIdx - lowerIdx + 7) % 7;

      if (dayDiffForward === 1) {
        // Lower day is immediately the day before Long Run
        warnings.push({
          type: 'lower_before_long_run',
          severity: 'warning',
          message: `Lower-Body Strength is scheduled on ${lowerDay.dayLabel}, directly before your Long Run on ${longRunDay.dayLabel}.`,
          suggestion: `Heavy leg training requires ~48 hours of recovery before high-volume running. Consider moving Lower Body to Wednesday or Friday, or shifting your Long Run to allow at least one rest/easy day between them.`
        });
      } else if (dayDiffForward === 0) {
        warnings.push({
          type: 'lower_before_long_run',
          severity: 'warning',
          message: `Lower-Body Strength and Long Run are both scheduled on the same day (${lowerDay.dayLabel}).`,
          suggestion: `Separate heavy leg lifting from your longest aerobic endurance run to prevent excessive neuromuscular fatigue and reduce injury risk.`
        });
      }
    }

    // 2. Plyometrics vs Hard Interval runs
    if (plyoDay && intervalDay) {
      const plyoIdx = getDayIndex(plyoDay.day);
      const intervalIdx = getDayIndex(intervalDay.day);
      const diff = (intervalIdx - plyoIdx + 7) % 7;

      if (diff === 1 || diff === 0) {
        warnings.push({
          type: 'plyo_before_hard_run',
          severity: 'warning',
          message: `Plyometrics are scheduled on ${plyoDay.dayLabel}, right before or on the same day as your hard Interval run on ${intervalDay.dayLabel}.`,
          suggestion: `High-impact plyometric drills stress the Achilles and calf tendons. Place them after an easy run or on an isolated recovery day rather than before intense speedwork.`
        });
      }
    }

    return warnings;
  }
};
