import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateFlowerDay, getGrowthStage, getDayLabel } from '../src/lib/flower/day';
import { getHealthState, getRevivingHealth } from '../src/lib/flower/health';

describe('Day-30 bloom specifics', () => {
  it('Day 30 returns bloom stage (not mature)', () => {
    assert.strictEqual(getGrowthStage(30), 'bloom');
  });

  it('Day 31 returns mature (post-bloom)', () => {
    assert.strictEqual(getGrowthStage(31), 'mature');
  });

  it('Day 29 returns pre_bloom (not yet bloom)', () => {
    assert.strictEqual(getGrowthStage(29), 'pre_bloom');
  });

  it('Day 30 label says Bloom', () => {
    assert.strictEqual(getDayLabel('bloom'), 'Bloom');
  });

  it('Day 30 is Blooming', () => {
    const stage = getGrowthStage(30);
    assert.strictEqual(stage === 'bloom', true);
  });

  it('Day 31 is NOT Blooming', () => {
    const stage = getGrowthStage(31);
    assert.strictEqual(stage !== 'bloom', true);
  });
});

describe('Reviving health state', () => {
  it('returns reviving when wilting plant gets care today', () => {
    const result = getRevivingHealth('2026-06-15', '2026-06-15', 'wilting');
    assert.strictEqual(result, 'reviving');
  });

  it('returns healthy when healthy plant gets care', () => {
    const result = getRevivingHealth('2026-06-15', '2026-06-15', 'healthy');
    assert.strictEqual(result, 'healthy');
  });

  it('returns thirsty when plant missed 2 days', () => {
    const result = getRevivingHealth('2026-06-13', '2026-06-15', 'healthy');
    assert.strictEqual(result, 'thirsty');
  });

  it('returns healthy when thirsty plant gets care', () => {
    const result = getRevivingHealth('2026-06-15', '2026-06-15', 'thirsty');
    assert.strictEqual(result, 'healthy');
  });

  it('returns reviving only from wilting state', () => {
    assert.strictEqual(getRevivingHealth('2026-06-15', '2026-06-15', 'wilting'), 'reviving');
    assert.notStrictEqual(getRevivingHealth('2026-06-15', '2026-06-15', 'thirsty'), 'reviving');
    assert.notStrictEqual(getRevivingHealth('2026-06-15', '2026-06-15', 'healthy'), 'reviving');
  });
});

describe('Streak edge cases', () => {
  it('calculateFlowerDay handles year boundary', () => {
    const day = calculateFlowerDay('2026-12-30', '2027-01-02');
    assert.strictEqual(day, 3);
  });

  it('calculateFlowerDay handles leap year', () => {
    const day = calculateFlowerDay('2024-02-28', '2024-03-01');
    assert.strictEqual(day, 2);
  });

  it('calculateFlowerDay same day returns 0', () => {
    assert.strictEqual(calculateFlowerDay('2026-06-15', '2026-06-15'), 0);
  });
});
