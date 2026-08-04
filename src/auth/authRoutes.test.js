import { describe, expect, it } from 'vitest';
import { authPath, sanitizeReturnPath } from './authRoutes';

describe('sanitizeReturnPath', () => {
  it('accepts internal application paths', () => expect(sanitizeReturnPath('/workspace/branch/kitchen?tab=live')).toBe('/workspace/branch/kitchen?tab=live'));
  it.each(['https://evil.example', '//evil.example', '/\\evil.example', '/auth/callback', '%2F%2Fevil.example'])('rejects unsafe return path %s', (value) => expect(sanitizeReturnPath(value)).toBe('/account'));
  it('uses the provided fallback for missing values', () => expect(sanitizeReturnPath('', '/')).toBe('/'));
});

describe('authPath', () => {
  it('encodes a safe return path', () => expect(authPath('/auth/login', '/account?tab=orders')).toBe('/auth/login?returnTo=%2Faccount%3Ftab%3Dorders'));
  it('drops unsafe return paths', () => expect(authPath('/auth/login', '//evil.example')).toBe('/auth/login'));
});
