import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(resolve(process.cwd(), 'src/App.tsx'), 'utf8');
const landingSource = readFileSync(
  resolve(process.cwd(), 'src/pages/MercyBridgeLanding.tsx'),
  'utf8',
);

describe('MercyBridge public landing shell', () => {
  it('uses the shared MercyBridge shell without rendering a second landing header', () => {
    expect(appSource).toContain(
      'withMercyBridgeLayout(<MercyBridgeLanding />)',
    );
    expect(landingSource).not.toContain('<header');
    expect(landingSource).not.toContain('buildServiceHubUrl');
  });
});
