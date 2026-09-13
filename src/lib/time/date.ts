export function getCurrentDate(timezone?: string): string {
  const tz = timezone || 'UTC';
  const now = new Date();
  return now.toLocaleDateString('en-CA', { timeZone: tz });
}

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
