/**
 * Deterministic spaced-repetition interval:
 */
export function computeReviewIntervalDays(attempts: number): number {
  if (attempts <= 1) return 10;
  if (attempts <= 3) return 5;
  return 2;
}

export const MASTERY_THRESHOLD = 70;