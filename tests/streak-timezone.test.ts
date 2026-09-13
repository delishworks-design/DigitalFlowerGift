import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateStreak } from '../src/lib/care/streak';

describe('calculateStreak with timezone', () => {
  it('returns 0 for empty array', () => {
    assert.strictEqual(calculateStreak([], 'Asia/Manila'), 0);
  });

  it('returns 1 for single day matching today', () => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
    assert.strictEqual(calculateStreak([todayStr], 'Asia/Manila'), 1);
  });

  it('returns 2 for today and yesterday', () => {
    const now = new Date();
    const tz = 'Asia/Manila';
    const today = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const tStr = today.toISOString().split('T')[0];
    assert.strictEqual(calculateStreak([tStr, yStr], tz), 2);
  });

  it('returns 0 when last care was 2 days ago', () => {
    const now = new Date();
    const tz = 'Asia/Manila';
    const today = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }));
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const dStr = twoDaysAgo.toISOString().split('T')[0];
    assert.strictEqual(calculateStreak([dStr], tz), 0);
  });

  it('handles timezone difference (UTC vs Asia/Tokyo)', () => {
    const now = new Date();
    const utcDate = now.toLocaleDateString('en-CA', { timeZone: 'UTC' });
    // UTC may be a different day than Tokyo
    const tokyoDate = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    if (utcDate === tokyoDate) {
      assert.strictEqual(calculateStreak([utcDate], 'Asia/Tokyo'), 1);
    } else {
      // UTC is behind Tokyo - today in Tokyo is yesterday in UTC
      assert.strictEqual(calculateStreak([utcDate], 'Asia/Tokyo'), 0);
    }
  });

  it('ignores out-of-order dates', () => {
    const now = new Date();
    const tz = 'UTC';
    const today = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const tStr = today.toISOString().split('T')[0];
    assert.strictEqual(calculateStreak([yStr, tStr], tz), 2);
  });

  it('stops streak on gap', () => {
    const now = new Date();
    const tz = 'UTC';
    const today = new Date(now.toLocaleDateString('en-CA', { timeZone: tz }));
    const d1 = new Date(today); d1.setDate(d1.getDate() - 1);
    const d3 = new Date(today); d3.setDate(d3.getDate() - 3);
    const dates = [
      today.toISOString().split('T')[0],
      d1.toISOString().split('T')[0],
      d3.toISOString().split('T')[0],
    ];
    assert.strictEqual(calculateStreak(dates, tz), 2);
  });
});
