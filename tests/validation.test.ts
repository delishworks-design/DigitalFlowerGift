import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createGiftSchema } from '../src/lib/validation/schemas';

describe('createGiftSchema with recipientTimezone', () => {
  const validBase = {
    flowerType: 'rose',
    flowerName: 'Rosebud',
    recipientName: 'Alice',
    giverName: 'Bob',
    personalMessage: 'Happy birthday!',
    bloomMessage: 'You bloomed!',
    startDate: '2026-01-15',
  };

  it('accepts valid timezone', () => {
    const result = createGiftSchema.safeParse({
      ...validBase,
      recipientTimezone: 'Asia/Manila',
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.recipientTimezone, 'Asia/Manila');
    }
  });

  it('defaults to Asia/Manila when no timezone provided', () => {
    const result = createGiftSchema.safeParse(validBase);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.recipientTimezone, 'Asia/Manila');
    }
  });

  it('rejects invalid timezone', () => {
    const result = createGiftSchema.safeParse({
      ...validBase,
      recipientTimezone: 'Invalid/Zone',
    });
    assert.strictEqual(result.success, false);
  });

  it('accepts various valid timezones', () => {
    const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'UTC'];
    for (const tz of timezones) {
      const result = createGiftSchema.safeParse({
        ...validBase,
        recipientTimezone: tz,
      });
      assert.strictEqual(result.success, true, `Failed for timezone: ${tz}`);
    }
  });
});

describe('createGiftSchema validation', () => {
  it('rejects empty recipient name', () => {
    const result = createGiftSchema.safeParse({
      flowerType: 'rose',
      flowerName: 'Rosebud',
      recipientName: '',
      personalMessage: 'Hi',
      bloomMessage: 'Bloom',
      startDate: '2026-01-15',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects invalid date format', () => {
    const result = createGiftSchema.safeParse({
      flowerType: 'rose',
      flowerName: 'Rosebud',
      recipientName: 'Alice',
      personalMessage: 'Hi',
      bloomMessage: 'Bloom',
      startDate: '01-15-2026',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects invalid flower type', () => {
    const result = createGiftSchema.safeParse({
      flowerType: 'cactus',
      flowerName: 'Cactus',
      recipientName: 'Alice',
      personalMessage: 'Hi',
      bloomMessage: 'Bloom',
      startDate: '2026-01-15',
    });
    assert.strictEqual(result.success, false);
  });
});
