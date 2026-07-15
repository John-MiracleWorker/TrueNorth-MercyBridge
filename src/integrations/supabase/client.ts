// Supabase client configuration
// Uses environment variables for security - see .env.example for setup
import { createClient } from '@supabase/supabase-js';
import { cookieStorage } from '@/lib/cookieStorage';
import { resolveSupabaseClientConfig } from './config';

interface DenoRuntime {
  env?: {
    get: (name: string) => string | undefined;
  };
}

const denoRuntime = (globalThis as typeof globalThis & { Deno?: DenoRuntime }).Deno;
const viteEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env;

// Prefer Vite env in browser builds, but allow Deno env during Deno-based tests.
const config = resolveSupabaseClientConfig({
  VITE_SUPABASE_URL: viteEnv?.VITE_SUPABASE_URL ?? denoRuntime?.env?.get('VITE_SUPABASE_URL'),
  VITE_SUPABASE_PUBLISHABLE_KEY:
    viteEnv?.VITE_SUPABASE_PUBLISHABLE_KEY ??
    denoRuntime?.env?.get('VITE_SUPABASE_PUBLISHABLE_KEY'),
});

export const supabase = createClient(config.url, config.key, {
  auth: {
    storage: typeof document !== 'undefined' ? cookieStorage : (typeof localStorage !== 'undefined' ? localStorage : undefined),
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: false,
  }
});