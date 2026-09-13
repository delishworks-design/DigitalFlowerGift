import type { CareType, CareEvent } from '@/types';

export const XP_VALUES: Record<CareType, number> = {
  water: 10,
  sunlight: 5,
  love: 5,
};

export const DAILY_XP_CAP = 20;
export const VISIT_XP = 5;

export function calculateDailyXp(careEvents: CareEvent[]): number {
  let total = 0;
  for (const event of careEvents) {
    total += event.xp_awarded;
  }
  return Math.min(total, DAILY_XP_CAP);
}

export function canPerformCare(careType: CareType, todayEvents: CareType[]): boolean {
  return !todayEvents.includes(careType);
}

export function getTodayXpRemaining(todayEvents: CareType[]): number {
  const used = todayEvents.reduce((sum, type) => sum + XP_VALUES[type], 0);
  return Math.max(0, DAILY_XP_CAP - used);
}
