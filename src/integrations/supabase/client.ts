// Supabase client configuration
// Uses environment variables for security - see .env.example for setup
import { createClient } from '@supabase/supabase-js';
import { cookieStorage } from '@/lib/cookieStorage';

interface DenoRuntime {
  env?: {
    get: (name: string) => string | undefined;
  };
}

const denoRuntime = (globalThis as typeof globalThis & { Deno?: DenoRuntime }).Deno;
const viteEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env;

// Prefer Vite env in browser builds, but allow Deno env during Deno-based tests.
const SUPABASE_URL = viteEnv?.VITE_SUPABASE_URL ?? denoRuntime?.env?.get('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY =
  viteEnv?.VITE_SUPABASE_ANON_KEY ?? denoRuntime?.env?.get('VITE_SUPABASE_ANON_KEY');

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (import.meta.env.PROD) {
    throw new Error(
      'Missing required Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  console.warn(
    'Missing required Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Provide fallback values so the app doesn't crash on import (avoids white screen)
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(url, key, {
  auth: {
    storage: typeof document !== 'undefined' ? cookieStorage : (typeof localStorage !== 'undefined' ? localStorage : undefined),
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: false,
  }
});