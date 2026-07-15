# Shared Supabase ownership

MercyBridge and TrueNorth use the same hosted Supabase project, but **TrueNorth is the only schema and backend deployment owner**.

Canonical backend source:

- `/Users/tiuni/TrueNorth_webApp/supabase/migrations`
- `/Users/tiuni/TrueNorth_webApp/supabase/functions`
- `/Users/tiuni/TrueNorth_webApp/src/integrations/supabase/types.ts`

The SQL files in this MercyBridge directory are historical development references. Do not run any of the following from this repository:

```sh
supabase db push
supabase migration repair
supabase functions deploy
```

New MercyBridge schema work must be authored as a forward migration in TrueNorth, reviewed there, deployed there, and followed by regeneration of client types. MercyBridge should receive only the generated type contract and client-facing code.

For local UI development, point `.env` at the shared project with its current `sb_publishable_...` key. Never use a service-role or `sb_secret_...` key in Vite variables.
