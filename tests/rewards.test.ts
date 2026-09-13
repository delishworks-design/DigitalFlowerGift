import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

interface RewardDef { key: string; day: number; title: string; description: string; icon: string; }
interface ExistingReward { reward_key: string; }

const REWARD_DEFINITIONS: RewardDef[] = [
  { key: 'first_steps', day: 3, title: 'First Steps', description: 'You helped your flower take its first steps.', icon: '🌱' },
  { key: 'one_week', day: 7, title: 'One Week Together', description: 'Seven days of caring.', icon: '🌿' },
  { key: 'first_bud', day: 14, title: 'First Bud', description: 'A bud begins to form.', icon: '🌼' },
  { key: 'almost_there', day: 21, title: 'Almost There', description: 'The bloom is near.', icon: '🌺' },
  { key: 'first_bloom', day: 30, title: 'First Bloom', description: 'Thirty days together.', icon: '🌸' },
];

function getUnlockedRewards(day: number): RewardDef[] {
  return REWARD_DEFINITIONS.filter((r) => day >= r.day);
}

function getNewlyUnlockedRewards(day: number, existingRewards: ExistingReward[]): RewardDef[] {
  const existingKeys = new Set(existingRewards.map((r) => r.reward_key));
  return getUnlockedRewards(day).filter((r) => !existingKeys.has(r.key));
}

describe('getUnlockedRewards', () => {
  it('returns empty for day 0', () => { assert.equal(getUnlockedRewards(0).length, 0); });
  it('returns first_steps for day 3', () => {
    const rewards = getUnlockedRewards(3);
    assert.equal(rewards.length, 1);
    assert.equal(rewards[0].key, 'first_steps');
  });
  it('returns first_steps and one_week for day 7', () => {
    const rewards = getUnlockedRewards(7);
    assert.equal(rewards.length, 2);
    assert.ok(rewards.some(r => r.key === 'first_steps'));
    assert.ok(rewards.some(r => r.key === 'one_week'));
  });
  it('returns all 5 rewards for day 30', () => { assert.equal(getUnlockedRewards(30).length, 5); });
  it('returns all 5 rewards for day 100', () => { assert.equal(getUnlockedRewards(100).length, 5); });
});

describe('getNewlyUnlockedRewards', () => {
  it('returns all available when no existing rewards', () => {
    const newly = getNewlyUnlockedRewards(3, []);
    assert.equal(newly.length, 1);
    assert.equal(newly[0].key, 'first_steps');
  });
  it('returns none when already unlocked', () => {
    const newly = getNewlyUnlockedRewards(3, [{ reward_key: 'first_steps' }]);
    assert.equal(newly.length, 0);
  });
  it('returns only new rewards', () => {
    const newly = getNewlyUnlockedRewards(14, [{ reward_key: 'first_steps' }, { reward_key: 'one_week' }]);
    assert.equal(newly.length, 1);
    assert.equal(newly[0].key, 'first_bud');
  });
});
