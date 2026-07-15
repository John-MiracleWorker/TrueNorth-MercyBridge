import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const providerSource = readFileSync(
  resolve(process.cwd(), 'src/contexts/SafeAuthProvider.tsx'),
  'utf8',
);

describe('SafeAuthProvider session restoration', () => {
  it('delegates cross-domain restoration to the chunk-aware Supabase storage adapter', () => {
    expect(providerSource).toContain('supabase.auth.getSession()');
    expect(providerSource).not.toContain('document.cookie');
    expect(providerSource).not.toContain('importSessionFromCookie');
    expect(providerSource).not.toContain("includes('auth-token')");
  });
});
