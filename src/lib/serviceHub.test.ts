import { describe, expect, it } from 'vitest';
import { buildServiceHubUrl, buildTrueNorthLoginUrl } from './serviceHub';

const serviceHubOrigin = 'https://www.find-true-north.net';
const mercyBridgeOrigin = 'https://mercybridge.find-true-north.net';

describe('service hub integration URLs', () => {
  it('builds first-party TrueNorth URLs', () => {
    expect(buildServiceHubUrl('/hub', serviceHubOrigin)).toBe(
      'https://www.find-true-north.net/hub',
    );
  });

  it('includes the current MercyBridge destination in login redirects', () => {
    expect(
      buildTrueNorthLoginUrl(
        `${mercyBridgeOrigin}/request-help?category=utility`,
        serviceHubOrigin,
        mercyBridgeOrigin,
      ),
    ).toBe(
      'https://www.find-true-north.net/login?return_to=https%3A%2F%2Fmercybridge.find-true-north.net%2Frequest-help%3Fcategory%3Dutility',
    );
  });

  it('rejects a return destination outside MercyBridge', () => {
    expect(() =>
      buildTrueNorthLoginUrl(
        'https://attacker.example/phish',
        serviceHubOrigin,
        mercyBridgeOrigin,
      ),
    ).toThrow('MercyBridge return destination must use the MercyBridge origin');
  });

  it('supports Cloudflare preview and local origins by default', () => {
    const currentOrigin = window.location.origin;
    const loginUrl = new URL(buildTrueNorthLoginUrl(`${currentOrigin}/dashboard`));

    expect(loginUrl.origin).toBe(serviceHubOrigin);
    expect(loginUrl.searchParams.get('return_to')).toBe(`${currentOrigin}/dashboard`);
  });
});
