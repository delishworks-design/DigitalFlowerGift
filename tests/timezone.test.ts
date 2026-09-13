import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCurrentDate, isValidTimezone } from '../src/lib/time/date';

describe('getCurrentDate with timezone', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = getCurrentDate('Asia/Manila');
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('defaults to UTC when no timezone given', () => {
    const date = getCurrentDate();
    const utcDate = new Date().toISOString().split('T')[0];
    assert.strictEqual(date, utcDate);
  });

  it('returns correct date for Asia/Manila', () => {
    const date = getCurrentDate('Asia/Manila');
    const now = new Date();
    const expected = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
    assert.strictEqual(date, expected);
  });

  it('returns correct date for America/New_York', () => {
    const date = getCurrentDate('America/New_York');
    const now = new Date();
    const expected = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    assert.strictEqual(date, expected);
  });
});

describe('isValidTimezone', () => {
  it('returns true for valid timezones', () => {
    assert.strictEqual(isValidTimezone('Asia/Manila'), true);
    assert.strictEqual(isValidTimezone('America/New_York'), true);
    assert.strictEqual(isValidTimezone('Europe/London'), true);
    assert.strictEqual(isValidTimezone('UTC'), true);
  });

  it('returns false for invalid timezones', () => {
    assert.strictEqual(isValidTimezone('Invalid/Zone'), false);
    assert.strictEqual(isValidTimezone('NotATimezone'), false);
    assert.strictEqual(isValidTimezone(''), false);
  });
});
