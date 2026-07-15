interface SupabaseClientEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface SupabaseClientConfig {
  url: string;
  key: string;
  keySource: 'publishable';
}

export function resolveSupabaseClientConfig(env: SupabaseClientEnv): SupabaseClientConfig {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error(
      'Missing Supabase client configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  if (!publishableKey.startsWith('sb_publishable_')) {
    throw new Error(
      'Invalid Supabase client configuration. Expected an sb_publishable_ key.',
    );
  }

  return {
    url,
    key: publishableKey,
    keySource: 'publishable',
  };
}
