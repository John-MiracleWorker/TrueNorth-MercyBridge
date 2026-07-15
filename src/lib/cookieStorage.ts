// Cross-domain auth storage for MercyBridge
//
// Supabase expects a Storage-like adapter. We keep localStorage as the primary
// store (best for PKCE code verifier + no cookie size pressure), and mirror the
// main Supabase auth token into a parent-domain cookie so TrueNorth and
// MercyBridge can share the login session across subdomains.

import {
  readChunkedCookie,
  removeChunkedCookie,
  writeChunkedCookie,
} from '@/lib/cookieChunks';

const COOKIE_DOMAIN = '.find-true-north.net';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hasLocalStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

function isAuthTokenKey(key: string): boolean {
  return key.includes('auth-token') && !key.includes('code-verifier');
}

export const cookieStorage = {
  getItem: (key: string): string | null => {
    const localValue = hasLocalStorage() ? localStorage.getItem(key) : null;
    if (localValue) return localValue;

    // Fallback to the shared cookie when MercyBridge is opened from TrueNorth
    // and this subdomain has not written its own localStorage session yet.
    if (isAuthTokenKey(key)) return readChunkedCookie(key);
    return null;
  },

  setItem: (key: string, value: string): void => {
    if (hasLocalStorage()) localStorage.setItem(key, value);
    if (isAuthTokenKey(key)) {
      writeChunkedCookie(key, value, {
        domain: COOKIE_DOMAIN,
        maxAge: COOKIE_MAX_AGE,
      });
    }
  },

  removeItem: (key: string): void => {
    if (hasLocalStorage()) localStorage.removeItem(key);
    if (isAuthTokenKey(key)) {
      removeChunkedCookie(key, { domain: COOKIE_DOMAIN });
    }
  },
};
