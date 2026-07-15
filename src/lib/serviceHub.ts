const DEFAULT_SERVICE_HUB_ORIGIN = 'https://www.find-true-north.net';
const DEFAULT_MERCYBRIDGE_ORIGIN = 'https://mercybridge.find-true-north.net';

function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Integration origin must use HTTP or HTTPS');
  }
  return url.origin;
}

export function getServiceHubOrigin(
  configuredOrigin = import.meta.env.VITE_TRUENORTH_URL,
): string {
  return normalizeOrigin(configuredOrigin || DEFAULT_SERVICE_HUB_ORIGIN);
}

export function getMercyBridgeOrigin(
  configuredOrigin = import.meta.env.VITE_MERCYBRIDGE_URL,
): string {
  if (configuredOrigin) return normalizeOrigin(configuredOrigin);
  if (typeof window !== 'undefined') return window.location.origin;
  return DEFAULT_MERCYBRIDGE_ORIGIN;
}

export function buildServiceHubUrl(path = '/hub', configuredOrigin?: string): string {
  const origin = getServiceHubOrigin(configuredOrigin);
  const normalizedPath = `/${path.trim().replace(/^\/+/, '')}`;
  return new URL(normalizedPath, `${origin}/`).toString();
}

export function buildTrueNorthLoginUrl(
  returnTo: string,
  configuredServiceHubOrigin?: string,
  configuredMercyBridgeOrigin?: string,
): string {
  const mercyBridgeOrigin = configuredMercyBridgeOrigin
    ? getMercyBridgeOrigin(configuredMercyBridgeOrigin)
    : typeof window !== 'undefined'
      ? window.location.origin
      : getMercyBridgeOrigin();
  const destination = new URL(returnTo, `${mercyBridgeOrigin}/`);
  if (destination.origin !== mercyBridgeOrigin) {
    throw new Error('MercyBridge return destination must use the MercyBridge origin');
  }

  const loginUrl = new URL('/login', `${getServiceHubOrigin(configuredServiceHubOrigin)}/`);
  loginUrl.searchParams.set('return_to', destination.toString());
  return loginUrl.toString();
}
