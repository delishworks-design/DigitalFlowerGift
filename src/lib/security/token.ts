import crypto from 'crypto';

export function generateSecureToken(length: number = 32): string {
  const bytes = crypto.randomBytes(length);
  return bytes
    .toString('base64url')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, length);
}
