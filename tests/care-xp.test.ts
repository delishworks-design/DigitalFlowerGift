import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type CareType = 'water' | 'sunlight' | 'love';
interface CareEvent { xp_awarded: number; }

const XP_VALUES: Record<CareType, number> = { water: 10, sunlight: 5, love: 5 };
const DAILY_XP_CAP = 20;

function calculateDailyXp(careEvents: CareEvent[]): number {
  let total = 0;
  for (const event of careEvents) total += event.xp_awarded;
  return Math.min(total, DAILY_XP_CAP);
}

function canPerformCare(careType: CareType, todayEvents: CareType[]): boolean {
  return !todayEvents.includes(careType);
}

function getTodayXpRemaining(todayEvents: CareType[]): number {
  const used = todayEvents.reduce((sum, type) => sum + XP_VALUES[type], 0);
  return Math.max(0, DAILY_XP_CAP - used);
}

describe('XP values', () => {
  it('water is 10 XP', () => { assert.equal(XP_VALUES.water, 10); });
  it('sunlight is 5 XP', () => { assert.equal(XP_VALUES.sunlight, 5); });
  it('love is 5 XP', () => { assert.equal(XP_VALUES.love, 5); });
  it('daily cap is 20', () => { assert.equal(DAILY_XP_CAP, 20); });
});

describe('calculateDailyXp', () => {
  it('returns 0 for empty events', () => { assert.equal(calculateDailyXp([]), 0); });
  it('calculates water XP', () => { assert.equal(calculateDailyXp([{ xp_awarded: 10 }]), 10); });
  it('calculates multiple events', () => {
    assert.equal(calculateDailyXp([{ xp_awarded: 10 }, { xp_awarded: 5 }]), 15);
  });
  it('caps at 20', () => {
    assert.equal(calculateDailyXp([{ xp_awarded: 10 }, { xp_awarded: 5 }, { xp_awarded: 5 }]), 20);
  });
});

describe('canPerformCare', () => {
  it('allows water when no water done', () => { assert.equal(canPerformCare('water', ['sunlight']), true); });
  it('prevents water when water already done', () => { assert.equal(canPerformCare('water', ['water']), false); });
  it('prevents sunlight when sunlight already done', () => { assert.equal(canPerformCare('sunlight', ['sunlight']), false); });
});

describe('getTodayXpRemaining', () => {
  it('returns 20 for no events', () => { assert.equal(getTodayXpRemaining([]), 20); });
  it('returns 10 after water', () => { assert.equal(getTodayXpRemaining(['water']), 10); });
  it('returns 15 after sunlight', () => { assert.equal(getTodayXpRemaining(['sunlight']), 15); });
  it('returns 0 after all three', () => { assert.equal(getTodayXpRemaining(['water', 'sunlight', 'love']), 0); });
});
