export function calculateStreak(careDates: string[]): number {
  if (careDates.length === 0) return 0;

  const sorted = [...careDates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const expectedDate = new Date(today);

  for (let i = 0; i < sorted.length; i++) {
    const careDate = new Date(sorted[i] + 'T00:00:00Z');
    careDate.setHours(0, 0, 0, 0);

    if (careDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (careDate.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  return streak;
}
