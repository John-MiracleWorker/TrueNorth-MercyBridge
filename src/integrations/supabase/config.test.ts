import { describe, expect, it } from 'vitest';
import { resolveSupabaseClientConfig } from './config';

describe('resolveSupabaseClientConfig', () => {
  it('accepts the current publishable-key contract', () => {
    expect(
      resolveSupabaseClientConfig({
        VITE_SUPABASE_URL: 'https://project.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_current',
      }),
    ).toEqual({
      url: 'https://project.supabase.co',
      key: 'sb_publishable_current',
      keySource: 'publishable',
    });
  });

  it('rejects the legacy anonymous-key fallback', () => {
    const legacyOnlyEnv = {
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'legacy-fallback',
    };

    expect(() => resolveSupabaseClientConfig(legacyOnlyEnv)).toThrow(
      'Missing Supabase client configuration',
    );
  });

  it('rejects keys outside the sb_publishable contract', () => {
    expect(() =>
      resolveSupabaseClientConfig({
        VITE_SUPABASE_URL: 'https://project.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'legacy-or-malformed-key',
      }),
    ).toThrow('Expected an sb_publishable_ key');
  });

  it('fails closed when required configuration is missing', () => {
    expect(() => resolveSupabaseClientConfig({ VITE_SUPABASE_URL: '' })).toThrow(
      'Missing Supabase client configuration',
    );
  });
});
