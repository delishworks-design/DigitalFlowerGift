import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkRateLimit } from '../src/lib/security/rate-limit';

describe('checkRateLimit', () => {
  it('allows first request', () => {
    const result = checkRateLimit('test-key-1', 3, 60_000);
    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.remaining, 2);
  });

  it('tracks count correctly', () => {
    const key = 'test-key-tracking';
    checkRateLimit(key, 5, 60_000);
    checkRateLimit(key, 5, 60_000);
    const third = checkRateLimit(key, 5, 60_000);
    assert.strictEqual(third.allowed, true);
    assert.strictEqual(third.remaining, 2);
  });

  it('blocks after limit exceeded', () => {
    const key = 'test-key-block';
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    const blocked = checkRateLimit(key, 2, 60_000);
    assert.strictEqual(blocked.allowed, false);
    assert.strictEqual(blocked.remaining, 0);
    assert.ok(blocked.resetIn > 0);
  });

  it('different keys are independent', () => {
    const r1 = checkRateLimit('key-a', 1, 60_000);
    const r2 = checkRateLimit('key-b', 1, 60_000);
    assert.strictEqual(r1.allowed, true);
    assert.strictEqual(r2.allowed, true);
    const r3 = checkRateLimit('key-a', 1, 60_000);
    assert.strictEqual(r3.allowed, false);
  });

  it('returns positive resetIn when blocked', () => {
    const key = 'test-reset-in';
    checkRateLimit(key, 1, 60_000);
    const result = checkRateLimit(key, 1, 60_000);
    assert.strictEqual(result.allowed, false);
    assert.ok(result.resetIn > 0);
    assert.ok(result.resetIn <= 60_000);
  });
});
