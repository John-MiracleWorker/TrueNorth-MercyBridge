import { afterEach, describe, expect, it } from 'vitest';
import {
  joinCookieChunks,
  readChunkedCookie,
  removeChunkedCookie,
  splitCookieValue,
  writeChunkedCookie,
} from './cookieChunks';

const cookieName = 'sb-test-auth-token';

afterEach(() => {
  removeChunkedCookie(cookieName);
});

describe('chunked cookie storage', () => {
  it('round-trips auth payloads larger than a browser cookie', () => {
    const value = JSON.stringify({
      access_token: 'a'.repeat(5200),
      refresh_token: 'r'.repeat(5200),
      user: { display_name: 'Mercy ✨ Bridge' },
    });

    const chunks = splitCookieValue(value);
    expect(chunks.length).toBeGreaterThan(1);
    expect(joinCookieChunks(chunks)).toBe(value);

    writeChunkedCookie(cookieName, value, { maxAge: 60 });
    expect(readChunkedCookie(cookieName)).toBe(value);
  });

  it('keeps small values compatible with a single cookie', () => {
    writeChunkedCookie(cookieName, 'small-session', { maxAge: 60 });

    expect(document.cookie).toContain(`${cookieName}=`);
    expect(document.cookie).not.toContain(`${cookieName}__chunks=`);
    expect(readChunkedCookie(cookieName)).toBe('small-session');
  });

  it('removes every chunk and metadata cookie', () => {
    writeChunkedCookie(cookieName, 'x'.repeat(9000), { maxAge: 60 });
    removeChunkedCookie(cookieName);

    expect(readChunkedCookie(cookieName)).toBeNull();
    expect(document.cookie).not.toContain(cookieName);
  });

  it('rejects malformed encoded chunks', () => {
    expect(joinCookieChunks(['%E0%A4%A'])).toBeNull();
  });
});
