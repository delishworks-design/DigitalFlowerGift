import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Inline the pure functions to test without module resolution issues
function calculateFlowerDay(startDate: string, currentDate: string): number {
  const start = new Date(startDate + 'T00:00:00Z');
  const current = new Date(currentDate + 'T00:00:00Z');
  const diffMs = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

type GrowthStage = 'seed' | 'sprout' | 'young_plant' | 'growing_plant' | 'bud' | 'pre_bloom' | 'bloom' | 'mature';

function getGrowthStage(day: number): GrowthStage {
  if (day <= 0) return 'seed';
  if (day <= 3) return 'sprout';
  if (day <= 7) return 'young_plant';
  if (day <= 14) return 'growing_plant';
  if (day <= 21) return 'bud';
  if (day <= 29) return 'pre_bloom';
  if (day === 30) return 'bloom';
  return 'mature';
}

function getDayLabel(stage: GrowthStage): string {
  const labels: Record<GrowthStage, string> = {
    seed: 'Seed', sprout: 'Sprout', young_plant: 'Young Plant',
    growing_plant: 'Growing Plant', bud: 'Bud', pre_bloom: 'Pre-Bloom',
    bloom: 'Bloom', mature: 'Mature Flower',
  };
  return labels[stage];
}

describe('calculateFlowerDay', () => {
  it('returns 0 for same day', () => {
    assert.equal(calculateFlowerDay('2026-09-13', '2026-09-13'), 0);
  });
  it('returns 1 for next day', () => {
    assert.equal(calculateFlowerDay('2026-09-13', '2026-09-14'), 1);
  });
  it('returns 29 for day 30', () => {
    assert.equal(calculateFlowerDay('2026-09-13', '2026-10-12'), 29);
  });
  it('returns 30 for day 31', () => {
    assert.equal(calculateFlowerDay('2026-09-13', '2026-10-13'), 30);
  });
  it('handles month boundaries', () => {
    assert.equal(calculateFlowerDay('2026-01-31', '2026-02-01'), 1);
  });
  it('returns 0 for future date before start', () => {
    assert.equal(calculateFlowerDay('2026-09-15', '2026-09-13'), 0);
  });
});

describe('getGrowthStage', () => {
  it('returns seed for day 0', () => { assert.equal(getGrowthStage(0), 'seed'); });
  it('returns sprout for day 1', () => { assert.equal(getGrowthStage(1), 'sprout'); });
  it('returns sprout for day 3', () => { assert.equal(getGrowthStage(3), 'sprout'); });
  it('returns young_plant for day 4', () => { assert.equal(getGrowthStage(4), 'young_plant'); });
  it('returns young_plant for day 7', () => { assert.equal(getGrowthStage(7), 'young_plant'); });
  it('returns growing_plant for day 8', () => { assert.equal(getGrowthStage(8), 'growing_plant'); });
  it('returns growing_plant for day 14', () => { assert.equal(getGrowthStage(14), 'growing_plant'); });
  it('returns bud for day 15', () => { assert.equal(getGrowthStage(15), 'bud'); });
  it('returns bud for day 21', () => { assert.equal(getGrowthStage(21), 'bud'); });
  it('returns pre_bloom for day 22', () => { assert.equal(getGrowthStage(22), 'pre_bloom'); });
  it('returns pre_bloom for day 29', () => { assert.equal(getGrowthStage(29), 'pre_bloom'); });
  it('returns bloom for day 30', () => { assert.equal(getGrowthStage(30), 'bloom'); });
  it('returns mature for day 31', () => { assert.equal(getGrowthStage(31), 'mature'); });
  it('returns mature for day 100', () => { assert.equal(getGrowthStage(100), 'mature'); });
});

describe('getDayLabel', () => {
  it('returns correct labels', () => {
    assert.equal(getDayLabel('seed'), 'Seed');
    assert.equal(getDayLabel('sprout'), 'Sprout');
    assert.equal(getDayLabel('young_plant'), 'Young Plant');
    assert.equal(getDayLabel('growing_plant'), 'Growing Plant');
    assert.equal(getDayLabel('bud'), 'Bud');
    assert.equal(getDayLabel('pre_bloom'), 'Pre-Bloom');
    assert.equal(getDayLabel('bloom'), 'Bloom');
    assert.equal(getDayLabel('mature'), 'Mature Flower');
  });
});
