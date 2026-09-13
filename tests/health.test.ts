import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type HealthState = 'healthy' | 'thirsty' | 'wilting' | 'reviving';

function getHealthState(lastCareDate: string | null, currentDate: string): HealthState {
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

describe('getHealthState', () => {
  it('returns wilting when no last care date', () => { assert.equal(getHealthState(null, '2026-09-13'), 'wilting'); });
  it('returns healthy when cared today', () => { assert.equal(getHealthState('2026-09-13', '2026-09-13'), 'healthy'); });
  it('returns healthy when cared yesterday', () => { assert.equal(getHealthState('2026-09-12', '2026-09-13'), 'healthy'); });
  it('returns thirsty when 2 days since care', () => { assert.equal(getHealthState('2026-09-11', '2026-09-13'), 'thirsty'); });
  it('returns wilting when 3+ days since care', () => { assert.equal(getHealthState('2026-09-10', '2026-09-13'), 'wilting'); });
  it('returns wilting when many days since care', () => { assert.equal(getHealthState('2026-09-01', '2026-09-13'), 'wilting'); });
});
