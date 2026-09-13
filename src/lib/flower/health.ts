import type { HealthState } from '@/types';

export function getHealthState(lastCareDate: string | null, currentDate: string): HealthState {
  if (!lastCareDate) return 'wilting';

  const last = new Date(lastCareDate + 'T00:00:00Z');
  const current = new Date(currentDate + 'T00:00:00Z');
  const diffMs = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'healthy';
  if (diffDays === 2) return 'thirsty';
  if (diffDays >= 3) return 'wilting';
  return 'healthy';
}

export function getRevivingHealth(lastCareDate: string | null, currentDate: string, previousHealth: HealthState): HealthState {
  const newHealth = getHealthState(lastCareDate, currentDate);
  if (previousHealth === 'wilting' && newHealth === 'healthy') return 'reviving';
  return newHealth;
}
