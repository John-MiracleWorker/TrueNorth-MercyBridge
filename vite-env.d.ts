/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_TRUENORTH_URL?: string;
  readonly VITE_MERCYBRIDGE_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
