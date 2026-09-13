export function calculateStreak(careDates: string[], timezone?: string): number {
  if (careDates.length === 0) return 0;

  const tz = timezone || 'UTC';
  const sorted = [...careDates].sort().reverse();

  // Get today in recipient timezone
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz });
  const today = new Date(todayStr + 'T00:00:00Z');

  let streak = 0;
  const expectedDate = new Date(today);

  for (let i = 0; i < sorted.length; i++) {
    const careDate = new Date(sorted[i] + 'T00:00:00Z');

    if (careDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (careDate.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  return streak;
}
