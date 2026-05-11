-- ==========================================================================
-- MercyBridge v2: Verified Payee Directory + Bill Verification Workflow
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$ BEGIN
  CREATE TYPE mercybridge_payee_category AS ENUM (
    'utility',
    'rent_landlord',
    'property_manager',
    'medical',
    'dental',
    'auto_repair',
    'insurance',
    'childcare',
    'school',
    'church_partner',
    'government_fee',
    'telecom',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mercybridge_payee_verification_status AS ENUM (
    'unverified',
    'pending_review',
    'limited_verified',
    'verified',
    'trusted',
    'suspended',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mercybridge_payee_match_status AS ENUM (
    'not_checked',
    'matched',
    'possible_match',
    'new_payee_pending',
    'no_match',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mercybridge_document_extraction_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'reviewed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mercybridge_payment_attempt_status AS ENUM (
    'pending',
    'initiated',
    'paid',
    'confirmed',
    'settled',
    'failed',
    'reversed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mercybridge_risk_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION mercybridge_normalize_text(input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN trim(regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', ' ', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE IF NOT EXISTS mercybridge_payees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  category mercybridge_payee_category NOT NULL DEFAULT 'other',
  website TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  ein_or_tax_id_encrypted TEXT,
  verification_status mercybridge_payee_verification_status NOT NULL DEFAULT 'unverified',
  verification_level INTEGER NOT NULL DEFAULT 0 CHECK (verification_level BETWEEN 0 AND 5),
  risk_score INTEGER NOT NULL DEFAULT 50 CHECK (risk_score BETWEEN 0 AND 100),
  trust_score INTEGER NOT NULL DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
  last_verified_at TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  suspension_reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payees_status ON mercybridge_payees(verification_status);
CREATE INDEX IF NOT EXISTS idx_payees_category ON mercybridge_payees(category);
CREATE INDEX IF NOT EXISTS idx_payees_normalized ON mercybridge_payees(normalized_name);
CREATE INDEX IF NOT EXISTS idx_payees_normalized_trgm ON mercybridge_payees USING gin(normalized_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_payees_trust ON mercybridge_payees(verification_level, trust_score DESC);

CREATE TABLE IF NOT EXISTS mercybridge_payee_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payee_id UUID NOT NULL REFERENCES mercybridge_payees(id) ON DELETE CASCADE,
  alias_text TEXT NOT NULL,
  normalized_alias TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'admin',
  confidence NUMERIC(5,4) NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(payee_id, normalized_alias)
);

CREATE INDEX IF NOT EXISTS idx_payee_aliases_payee ON mercybridge_payee_aliases(payee_id);
CREATE INDEX IF NOT EXISTS idx_payee_aliases_normalized ON mercybridge_payee_aliases(normalized_alias);
CREATE INDEX IF NOT EXISTS idx_payee_aliases_trgm ON mercybridge_payee_aliases USING gin(normalized_alias gin_trgm_ops);

CREATE TABLE IF NOT EXISTS mercybridge_need_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'bill',
  storage_path TEXT NOT NULL,
  safe_summary JSONB DEFAULT '{}',
  extracted_fields JSONB DEFAULT '{}',
  extraction_status mercybridge_document_extraction_status NOT NULL DEFAULT 'pending',
  extraction_confidence NUMERIC(5,4),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  retention_until TIMESTAMPTZ,
  purged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_need_documents_need ON mercybridge_need_documents(need_id);
CREATE INDEX IF NOT EXISTS idx_need_documents_status ON mercybridge_need_documents(extraction_status);

CREATE TABLE IF NOT EXISTS mercybridge_payee_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payee_id UUID NOT NULL REFERENCES mercybridge_payees(id) ON DELETE CASCADE,
  need_id UUID REFERENCES mercybridge_needs(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES auth.users(id),
  verification_type TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('passed', 'failed', 'partial', 'needs_more_info')),
  evidence JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payee_verifications_payee ON mercybridge_payee_verifications(payee_id);
CREATE INDEX IF NOT EXISTS idx_payee_verifications_need ON mercybridge_payee_verifications(need_id);

CREATE TABLE IF NOT EXISTS mercybridge_payee_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payee_id UUID NOT NULL REFERENCES mercybridge_payees(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('biller_portal', 'guest_pay_portal', 'card_by_phone', 'mailed_check', 'ach', 'wire', 'manual_other')),
  payment_url TEXT,
  mailing_address JSONB DEFAULT '{}',
  ach_details_encrypted TEXT,
  check_payable_to TEXT,
  phone_payment_allowed BOOLEAN NOT NULL DEFAULT false,
  phone TEXT,
  requires_account_number BOOLEAN NOT NULL DEFAULT false,
  requires_invoice_number BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'limited_verified', 'suspended', 'rejected')),
  last_successful_payment_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payee_payment_methods_payee ON mercybridge_payee_payment_methods(payee_id);
CREATE INDEX IF NOT EXISTS idx_payee_payment_methods_status ON mercybridge_payee_payment_methods(status);

CREATE TABLE IF NOT EXISTS mercybridge_payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  payee_id UUID REFERENCES mercybridge_payees(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES mercybridge_payee_payment_methods(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL,
  status mercybridge_payment_attempt_status NOT NULL DEFAULT 'pending',
  confirmation_number TEXT,
  receipt_storage_path TEXT,
  paid_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  failed_reason TEXT,
  reviewer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_need ON mercybridge_payment_attempts(need_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_payee ON mercybridge_payment_attempts(payee_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON mercybridge_payment_attempts(status);

CREATE TABLE IF NOT EXISTS mercybridge_risk_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  payee_id UUID REFERENCES mercybridge_payees(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL,
  severity mercybridge_risk_severity NOT NULL DEFAULT 'medium',
  message TEXT NOT NULL,
  evidence JSONB DEFAULT '{}',
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_flags_need ON mercybridge_risk_flags(need_id);
CREATE INDEX IF NOT EXISTS idx_risk_flags_payee ON mercybridge_risk_flags(payee_id);
CREATE INDEX IF NOT EXISTS idx_risk_flags_unresolved ON mercybridge_risk_flags(severity, created_at DESC) WHERE resolved_at IS NULL;

ALTER TABLE mercybridge_needs
  ADD COLUMN IF NOT EXISTS payee_id UUID REFERENCES mercybridge_payees(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payee_match_status mercybridge_payee_match_status NOT NULL DEFAULT 'not_checked',
  ADD COLUMN IF NOT EXISTS payee_match_confidence NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS payee_risk_score INTEGER CHECK (payee_risk_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS payee_review_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_needs_payee ON mercybridge_needs(payee_id);
CREATE INDEX IF NOT EXISTS idx_needs_payee_match_status ON mercybridge_needs(payee_match_status);

CREATE OR REPLACE FUNCTION mercybridge_set_payee_normalized_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_name := mercybridge_normalize_text(coalesce(NEW.legal_name, NEW.display_name));
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mercybridge_payees_normalized ON mercybridge_payees;
CREATE TRIGGER trigger_mercybridge_payees_normalized
BEFORE INSERT OR UPDATE OF legal_name, display_name ON mercybridge_payees
FOR EACH ROW EXECUTE FUNCTION mercybridge_set_payee_normalized_fields();

CREATE OR REPLACE FUNCTION mercybridge_set_alias_normalized_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_alias := mercybridge_normalize_text(NEW.alias_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mercybridge_payee_aliases_normalized ON mercybridge_payee_aliases;
CREATE TRIGGER trigger_mercybridge_payee_aliases_normalized
BEFORE INSERT OR UPDATE OF alias_text ON mercybridge_payee_aliases
FOR EACH ROW EXECUTE FUNCTION mercybridge_set_alias_normalized_fields();

CREATE OR REPLACE FUNCTION mercybridge_find_payee_matches(query_text TEXT, result_limit INTEGER DEFAULT 8)
RETURNS TABLE (
  payee_id UUID,
  display_name TEXT,
  legal_name TEXT,
  category mercybridge_payee_category,
  verification_status mercybridge_payee_verification_status,
  verification_level INTEGER,
  trust_score INTEGER,
  risk_score INTEGER,
  matched_alias TEXT,
  confidence NUMERIC
) AS $$
DECLARE
  normalized_query TEXT := mercybridge_normalize_text(query_text);
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT
      p.id AS payee_id,
      p.display_name,
      p.legal_name,
      p.category,
      p.verification_status,
      p.verification_level,
      p.trust_score,
      p.risk_score,
      p.display_name AS matched_alias,
      GREATEST(
        similarity(p.normalized_name, normalized_query),
        CASE WHEN p.normalized_name = normalized_query THEN 1 ELSE 0 END
      )::NUMERIC AS confidence
    FROM mercybridge_payees p
    WHERE normalized_query <> ''
      AND p.verification_status <> 'rejected'
      AND (p.normalized_name % normalized_query OR p.normalized_name LIKE '%' || normalized_query || '%')

    UNION ALL

    SELECT
      p.id AS payee_id,
      p.display_name,
      p.legal_name,
      p.category,
      p.verification_status,
      p.verification_level,
      p.trust_score,
      p.risk_score,
      a.alias_text AS matched_alias,
      (GREATEST(
        similarity(a.normalized_alias, normalized_query),
        CASE WHEN a.normalized_alias = normalized_query THEN 1 ELSE 0 END
      ) * a.confidence)::NUMERIC AS confidence
    FROM mercybridge_payee_aliases a
    JOIN mercybridge_payees p ON p.id = a.payee_id
    WHERE normalized_query <> ''
      AND p.verification_status <> 'rejected'
      AND (a.normalized_alias % normalized_query OR a.normalized_alias LIKE '%' || normalized_query || '%')
  ), best_per_payee AS (
    SELECT DISTINCT ON (c.payee_id)
      c.payee_id,
      c.display_name,
      c.legal_name,
      c.category,
      c.verification_status,
      c.verification_level,
      c.trust_score,
      c.risk_score,
      c.matched_alias,
      round(c.confidence, 4) AS confidence
    FROM candidates c
    ORDER BY c.payee_id, c.confidence DESC, c.trust_score DESC
  )
  SELECT
    b.payee_id,
    b.display_name,
    b.legal_name,
    b.category,
    b.verification_status,
    b.verification_level,
    b.trust_score,
    b.risk_score,
    b.matched_alias,
    b.confidence
  FROM best_per_payee b
  ORDER BY b.confidence DESC, b.trust_score DESC, b.verification_level DESC
  LIMIT LEAST(GREATEST(result_limit, 1), 20);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mercybridge_recalculate_payee_trust(target_payee_id UUID)
RETURNS VOID AS $$
DECLARE
  successful_payments INTEGER;
  failed_payments INTEGER;
  verified_checks INTEGER;
  new_trust INTEGER;
  new_level INTEGER;
BEGIN
  SELECT count(*) INTO successful_payments
  FROM mercybridge_payment_attempts
  WHERE payee_id = target_payee_id AND status IN ('confirmed', 'settled', 'paid');

  SELECT count(*) INTO failed_payments
  FROM mercybridge_payment_attempts
  WHERE payee_id = target_payee_id AND status IN ('failed', 'reversed');

  SELECT count(*) INTO verified_checks
  FROM mercybridge_payee_verifications
  WHERE payee_id = target_payee_id AND result = 'passed';

  new_trust := LEAST(100, GREATEST(0, (verified_checks * 12) + (successful_payments * 18) - (failed_payments * 25)));
  new_level := CASE
    WHEN successful_payments >= 3 THEN 4
    WHEN successful_payments >= 1 THEN 3
    WHEN verified_checks >= 2 THEN 2
    WHEN verified_checks >= 1 THEN 1
    ELSE 0
  END;

  UPDATE mercybridge_payees
  SET
    trust_score = new_trust,
    verification_level = GREATEST(verification_level, new_level),
    verification_status = CASE
      WHEN verification_status IN ('suspended', 'rejected') THEN verification_status
      WHEN successful_payments >= 3 THEN 'trusted'::mercybridge_payee_verification_status
      WHEN successful_payments >= 1 THEN 'verified'::mercybridge_payee_verification_status
      WHEN verified_checks >= 1 THEN 'limited_verified'::mercybridge_payee_verification_status
      ELSE verification_status
    END,
    last_verified_at = CASE WHEN verified_checks > 0 OR successful_payments > 0 THEN now() ELSE last_verified_at END,
    updated_at = now()
  WHERE id = target_payee_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mercybridge_after_payment_attempt_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payee_id IS NOT NULL THEN
    PERFORM mercybridge_recalculate_payee_trust(NEW.payee_id);
  END IF;
  IF NEW.payment_method_id IS NOT NULL AND NEW.status IN ('paid', 'confirmed', 'settled') THEN
    UPDATE mercybridge_payee_payment_methods
    SET last_successful_payment_at = COALESCE(NEW.paid_at, now()), updated_at = now()
    WHERE id = NEW.payment_method_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mercybridge_payment_attempt_trust ON mercybridge_payment_attempts;
CREATE TRIGGER trigger_mercybridge_payment_attempt_trust
AFTER INSERT OR UPDATE OF status, payee_id ON mercybridge_payment_attempts
FOR EACH ROW EXECUTE FUNCTION mercybridge_after_payment_attempt_change();

CREATE OR REPLACE FUNCTION mercybridge_after_payee_verification_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM mercybridge_recalculate_payee_trust(NEW.payee_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mercybridge_payee_verification_trust ON mercybridge_payee_verifications;
CREATE TRIGGER trigger_mercybridge_payee_verification_trust
AFTER INSERT OR UPDATE OF result ON mercybridge_payee_verifications
FOR EACH ROW EXECUTE FUNCTION mercybridge_after_payee_verification_change();

ALTER TABLE mercybridge_payees ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_payee_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_need_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_payee_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_payee_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_risk_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payees_admin_all ON mercybridge_payees;
CREATE POLICY payees_admin_all ON mercybridge_payees FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS payee_aliases_admin_all ON mercybridge_payee_aliases;
CREATE POLICY payee_aliases_admin_all ON mercybridge_payee_aliases FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS need_documents_admin_all ON mercybridge_need_documents;
CREATE POLICY need_documents_admin_all ON mercybridge_need_documents FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS need_documents_requester_select_own ON mercybridge_need_documents;
CREATE POLICY need_documents_requester_select_own ON mercybridge_need_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM mercybridge_needs n WHERE n.id = need_id AND n.requester_id = auth.uid())
  );

DROP POLICY IF EXISTS payee_verifications_admin_all ON mercybridge_payee_verifications;
CREATE POLICY payee_verifications_admin_all ON mercybridge_payee_verifications FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS payee_payment_methods_admin_all ON mercybridge_payee_payment_methods;
CREATE POLICY payee_payment_methods_admin_all ON mercybridge_payee_payment_methods FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS payment_attempts_admin_all ON mercybridge_payment_attempts;
CREATE POLICY payment_attempts_admin_all ON mercybridge_payment_attempts FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS payment_attempts_related_select ON mercybridge_payment_attempts;
CREATE POLICY payment_attempts_related_select ON mercybridge_payment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mercybridge_needs n
      LEFT JOIN mercybridge_contributions c ON c.need_id = n.id
      WHERE n.id = need_id AND (n.requester_id = auth.uid() OR c.sponsor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS risk_flags_admin_all ON mercybridge_risk_flags;
CREATE POLICY risk_flags_admin_all ON mercybridge_risk_flags FOR ALL USING (is_mercybridge_admin()) WITH CHECK (is_mercybridge_admin());

INSERT INTO mercybridge_payees (legal_name, display_name, category, website, phone, verification_status, verification_level, risk_score, trust_score)
VALUES
  ('Consumers Energy Company', 'Consumers Energy', 'utility', 'https://www.consumersenergy.com', '800-477-5050', 'verified', 2, 10, 40),
  ('DTE Energy', 'DTE Energy', 'utility', 'https://www.dteenergy.com', '800-477-4747', 'verified', 2, 10, 40),
  ('Xfinity / Comcast', 'Xfinity', 'telecom', 'https://www.xfinity.com', '800-934-6489', 'limited_verified', 2, 20, 30),
  ('Spectrum', 'Spectrum', 'telecom', 'https://www.spectrum.net', '833-267-6094', 'limited_verified', 2, 20, 30),
  ('State Farm Mutual Automobile Insurance Company', 'State Farm', 'insurance', 'https://www.statefarm.com', '800-782-8332', 'limited_verified', 2, 20, 30)
ON CONFLICT DO NOTHING;

INSERT INTO mercybridge_payee_aliases (payee_id, alias_text, source, confidence)
SELECT id, alias, 'seed', 1.0
FROM mercybridge_payees p
CROSS JOIN LATERAL (
  VALUES
    (p.display_name),
    (p.legal_name),
    (replace(lower(coalesce(p.website, '')), 'https://www.', ''))
) AS aliases(alias)
WHERE alias IS NOT NULL AND alias <> ''
ON CONFLICT DO NOTHING;

COMMENT ON TABLE mercybridge_payees IS 'MercyBridge v2 canonical verified payee directory.';
COMMENT ON TABLE mercybridge_payee_aliases IS 'Alternate names/domains used for fuzzy payee matching.';
COMMENT ON TABLE mercybridge_need_documents IS 'Private uploaded bill/invoice documents and reviewer-assisted extraction fields.';
COMMENT ON TABLE mercybridge_payee_payment_methods IS 'Internal-only approved routes for paying verified payees.';
COMMENT ON TABLE mercybridge_payment_attempts IS 'Manual payment operation history used to improve payee trust.';
COMMENT ON TABLE mercybridge_risk_flags IS 'Reviewer-facing fraud/safety warnings for needs and payees.';
