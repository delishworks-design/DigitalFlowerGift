import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

function generateSecureToken(length: number = 32): string {
  const bytes = crypto.randomBytes(length);
  return bytes.toString('base64url').replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
}

describe('generateSecureToken', () => {
  it('generates token of specified length', () => {
    assert.equal(generateSecureToken(32).length, 32);
  });
  it('generates URL-safe token', () => {
    assert.ok(/^[a-zA-Z0-9]+$/.test(generateSecureToken(32)));
  });
  it('generates unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) tokens.add(generateSecureToken(32));
    assert.equal(tokens.size, 100);
  });
  it('generates tokens of different lengths', () => {
    assert.equal(generateSecureToken(16).length, 16);
    assert.equal(generateSecureToken(64).length, 64);
  });
});
