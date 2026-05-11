-- ==========================================================================
-- Phase 1 Security Hardening: remove dangerous public RPC/table entry points
-- ============================================================================
-- Goal: stop obvious browser-callable admin/secret/database-introspection paths
-- without carpet-bombing normal table grants/RLS used by the app.

-- 1) Revoke direct browser execution for high-risk RPCs.
DO $$
DECLARE
  fn RECORD;
  dangerous_functions TEXT[] := ARRAY[
    'get_cron_secret',
    'execute_sql_query',
    'set_user_admin_flag',
    'toggle_test_pro_subscriptions',
    'get_database_stats',
    'get_tables',
    'get_table_columns'
  ];
BEGIN
  FOR fn IN
    SELECT n.nspname AS schema_name, p.proname AS function_name, p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY(dangerous_functions)
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn.signature);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn.signature);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', fn.signature);

    -- Backend/service-role paths remain possible. service_role normally bypasses
    -- RLS and can execute explicitly granted functions from Edge Functions.
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn.signature);
    END IF;

    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO postgres', fn.signature);
    END IF;
  END LOOP;
END $$;

COMMENT ON SCHEMA public IS 'Phase 1 hardening applied: dangerous admin/secret/introspection RPCs are revoked from browser roles.';

-- 2) Force a safe search_path on high-risk SECURITY DEFINER functions when present.
DO $$
DECLARE
  fn RECORD;
  harden_functions TEXT[] := ARRAY[
    'get_cron_secret',
    'execute_sql_query',
    'set_user_admin_flag',
    'toggle_test_pro_subscriptions',
    'get_database_stats',
    'get_tables',
    'get_table_columns',
    'is_mercybridge_admin',
    'mercybridge_find_payee_matches',
    'mercybridge_recalculate_payee_trust'
  ];
BEGIN
  FOR fn IN
    SELECT n.nspname AS schema_name, p.proname AS function_name, p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY(harden_functions)
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, extensions', fn.signature);
  END LOOP;
END $$;

-- 3) Lock down obviously service-only tables with permissive TRUE policies.
-- This only targets the named tables and only drops policies whose USING or
-- WITH CHECK is literally true. Normal feature-specific RLS is left alone.
DO $$
DECLARE
  pol RECORD;
  target_tables TEXT[] := ARRAY[
    'payment_events',
    'podcast_generation_jobs',
    'welcome_emails_sent'
  ];
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY(target_tables)
      AND (
        lower(coalesce(qual, '')) = 'true'
        OR lower(coalesce(with_check, '')) = 'true'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Add restrictive admin/service policies for those tables if they exist.
DO $$
BEGIN
  IF to_regclass('public.payment_events') IS NOT NULL THEN
    ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS payment_events_admin_all ON public.payment_events;
    CREATE POLICY payment_events_admin_all ON public.payment_events
      FOR ALL USING (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      )
      WITH CHECK (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      );
  END IF;

  IF to_regclass('public.podcast_generation_jobs') IS NOT NULL THEN
    ALTER TABLE public.podcast_generation_jobs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS podcast_generation_jobs_admin_all ON public.podcast_generation_jobs;
    CREATE POLICY podcast_generation_jobs_admin_all ON public.podcast_generation_jobs
      FOR ALL USING (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      )
      WITH CHECK (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      );
  END IF;

  IF to_regclass('public.welcome_emails_sent') IS NOT NULL THEN
    ALTER TABLE public.welcome_emails_sent ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS welcome_emails_sent_admin_all ON public.welcome_emails_sent;
    CREATE POLICY welcome_emails_sent_admin_all ON public.welcome_emails_sent
      FOR ALL USING (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      )
      WITH CHECK (
        auth.role() = 'service_role'
        OR public.is_mercybridge_admin()
      );
  END IF;
END $$;

-- 4) Make sure cron-secret exposure is blocked even if default grants are later changed.
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'get_cron_secret'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn.signature);
  END LOOP;
END $$;
