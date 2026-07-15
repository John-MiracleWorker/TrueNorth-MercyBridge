const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim();
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !publishableKey) {
  throw new Error(
    'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required for deployment.',
  );
}

if (!publishableKey.startsWith('sb_publishable_')) {
  throw new Error(
    'VITE_SUPABASE_PUBLISHABLE_KEY must be a current sb_publishable_ key; legacy JWT anon keys are not deployable.',
  );
}

const endpoint = new URL('/rest/v1/mercybridge_public_needs', supabaseUrl);
endpoint.searchParams.set('select', 'id');
endpoint.searchParams.set('limit', '1');

const response = await fetch(endpoint, {
  headers: {
    apikey: publishableKey,
  },
});

if (!response.ok) {
  let detail = '';
  try {
    const payload = await response.json();
    detail = typeof payload?.message === 'string' ? `: ${payload.message}` : '';
  } catch {
    // Avoid logging response bodies that are not structured API errors.
  }
  throw new Error(`Supabase client smoke check failed with HTTP ${response.status}${detail}`);
}

console.log('Supabase publishable key and MercyBridge REST access verified.');
