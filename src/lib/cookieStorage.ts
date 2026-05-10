// Cross-domain auth storage for MercyBridge
//
// Supabase expects a Storage-like adapter. We keep localStorage as the primary
// store (best for PKCE code verifier + no cookie size pressure), and mirror the
// main Supabase auth token into a parent-domain cookie so TrueNorth and
// MercyBridge can share the login session across subdomains.

const COOKIE_DOMAIN = '.find-true-north.net';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

function hasLocalStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

function isAuthTokenKey(key: string): boolean {
  return key.includes('auth-token') && !key.includes('code-verifier');
}

function getCookie(name: string): string | null {
  if (!hasDocument()) return null;
  const match = document.cookie.match(new RegExp('(^| )' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string | null, maxAge = COOKIE_MAX_AGE) {
  if (!hasDocument()) return;

  if (value === null) {
    document.cookie = `${name}=; domain=${COOKIE_DOMAIN}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; domain=${COOKIE_DOMAIN}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export const cookieStorage = {
  getItem: (key: string): string | null => {
    const localValue = hasLocalStorage() ? localStorage.getItem(key) : null;
    if (localValue) return localValue;

    // Fallback to the shared cookie when MercyBridge is opened from TrueNorth
    // and this subdomain has not written its own localStorage session yet.
    if (isAuthTokenKey(key)) return getCookie(key);
    return null;
  },

  setItem: (key: string, value: string): void => {
    if (hasLocalStorage()) localStorage.setItem(key, value);
    if (isAuthTokenKey(key)) setCookie(key, value);
  },

  removeItem: (key: string): void => {
    if (hasLocalStorage()) localStorage.removeItem(key);
    if (isAuthTokenKey(key)) setCookie(key, null);
  },
};
