// Cookie-based storage for Supabase auth that works across subdomains
// This allows TrueNorth and MercyBridge to share the same auth session
//
// IMPORTANT: Supabase already prefixes auth keys with "sb-<project-ref>-auth-token"
// We do NOT add an additional prefix - we use the key as Supabase provides it.

const COOKIE_DOMAIN = '.find-true-north.net';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string | null, maxAge = COOKIE_MAX_AGE) {
  if (value === null) {
    document.cookie = `${name}=; domain=${COOKIE_DOMAIN}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; domain=${COOKIE_DOMAIN}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export const cookieStorage = {
  getItem: (key: string): string | null => {
    return getCookie(key);
  },
  setItem: (key: string, value: string): void => {
    setCookie(key, value);
  },
  removeItem: (key: string): void => {
    setCookie(key, null);
  },
};
