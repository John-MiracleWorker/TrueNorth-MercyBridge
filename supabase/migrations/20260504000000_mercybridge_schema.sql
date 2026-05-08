-- ============================================================================
-- MercyBridge Database Schema
-- Christian direct-bill sponsorship platform
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE need_category AS ENUM (
  'utilities',
  'rent_housing', 
  'medical',
  'transportation',
  'childcare',
  'food',
  'other_essentials'
);

CREATE TYPE need_status AS ENUM (
  'draft',
  'submitted',
  'more_info_needed',
  'approved',
  'partially_funded',
  'funded',
  'payment_pending',
  'paid',
  'rejected',
  'cancelled'
);

CREATE TYPE verification_level AS ENUM (
  'level_1_document',
  'level_2_identity',
  'level_3_hardship',
  'level_4_community'
);

CREATE TYPE urgency_level AS ENUM (
  'critical',
  'high',
  'medium',
  'low'
);

CREATE TYPE contribution_status AS ENUM (
  'pending',
  'completed',
  'refunded',
  'failed'
);

CREATE TYPE review_action AS ENUM (
  'approved',
  'rejected',
  'more_info',
  'escalated'
);

CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'skipped'
);

-- ============================================================================
-- MAIN TABLE: mercybridge_needs
-- ============================================================================

CREATE TABLE mercybridge_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Public-facing fields
  title TEXT NOT NULL,
  category need_category NOT NULL,
  biller_name TEXT NOT NULL,
  public_location TEXT,
  
  -- Financial amounts
  bill_amount DECIMAL(12, 2) NOT NULL CHECK (bill_amount > 0),
  amount_requested DECIMAL(12, 2) NOT NULL CHECK (amount_requested > 0),
  amount_funded DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (amount_funded >= 0),
  amount_remaining DECIMAL(12, 2) GENERATED ALWAYS AS (amount_requested - amount_funded) STORED,
  
  -- Dates
  due_date DATE,
  
  -- Private fields (sensitive)
  hardship_summary_private TEXT NOT NULL,
  private_payment_details TEXT,
  document_urls JSONB DEFAULT '[]',
  
  -- Public summary (admin-approved)
  hardship_summary_public TEXT,
  
  -- Status tracking
  status need_status NOT NULL DEFAULT 'draft',
  verification_level verification_level NOT NULL DEFAULT 'level_1_document',
  urgency_level urgency_level NOT NULL DEFAULT 'medium',
  
  -- Admin tracking
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  rejection_reason TEXT,
  
  -- Payment tracking
  payment_confirmation_note TEXT,
  payment_proof_url TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  funded_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_amounts CHECK (amount_requested <= bill_amount),
  CONSTRAINT valid_dates CHECK (due_date IS NULL OR due_date >= created_at::date)
);

-- Indexes
CREATE INDEX idx_needs_status ON mercybridge_needs(status);
CREATE INDEX idx_needs_category ON mercybridge_needs(category);
CREATE INDEX idx_needs_urgency ON mercybridge_needs(urgency_level);
CREATE INDEX idx_needs_requester ON mercybridge_needs(requester_id);
CREATE INDEX idx_needs_verification ON mercybridge_needs(verification_level);
CREATE INDEX idx_needs_public ON mercybridge_needs(status, verification_level) WHERE status = 'approved';

-- ============================================================================
-- CONTRIBUTIONS TABLE
-- ============================================================================

CREATE TABLE mercybridge_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status contribution_status NOT NULL DEFAULT 'pending',
  
  -- Payment tracking (mock for MVP)
  stripe_payment_intent_id TEXT,
  
  -- Sponsor info
  gift_note TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contributions_need ON mercybridge_contributions(need_id);
CREATE INDEX idx_contributions_sponsor ON mercybridge_contributions(sponsor_id);
CREATE INDEX idx_contributions_status ON mercybridge_contributions(status);

-- ============================================================================
-- ADMIN REVIEWS TABLE
-- ============================================================================

CREATE TABLE mercybridge_admin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  
  action review_action NOT NULL,
  previous_status need_status,
  new_status need_status NOT NULL,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_admin_reviews_need ON mercybridge_admin_reviews(need_id);
CREATE INDEX idx_admin_reviews_reviewer ON mercybridge_admin_reviews(reviewer_id);

-- ============================================================================
-- STEWARDSHIP PLANS TABLE
-- ============================================================================

CREATE TABLE mercybridge_stewardship_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  need_id UUID REFERENCES mercybridge_needs(id) ON DELETE SET NULL,
  
  generated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Plan content (JSON for flexibility)
  financial_summary TEXT NOT NULL,
  urgency_ranking JSONB DEFAULT '[]',
  seven_day_plan JSONB DEFAULT '[]',
  hardship_budget_suggestions TEXT,
  creditor_scripts JSONB DEFAULT '{}',
  encouragement TEXT,
  scripture_references JSONB DEFAULT '[]',
  next_step TEXT,
  disclaimer TEXT DEFAULT 'This is educational stewardship guidance, not legal, tax, investment, or professional financial advice.',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_stewardship_requester ON mercybridge_stewardship_plans(requester_id);
CREATE INDEX idx_stewardship_need ON mercybridge_stewardship_plans(need_id);

-- ============================================================================
-- STEWARDSHIP TASKS TABLE
-- ============================================================================

CREATE TABLE mercybridge_stewardship_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES mercybridge_stewardship_plans(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_plan ON mercybridge_stewardship_tasks(plan_id);

-- ============================================================================
-- STATUS UPDATES TABLE
-- ============================================================================

CREATE TABLE mercybridge_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('progress', 'funded', 'paid', 'review', 'general')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_status_updates_need ON mercybridge_status_updates(need_id);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE mercybridge_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('need', 'contribution', 'user', 'payment')),
  target_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_actor ON mercybridge_audit_logs(actor_id);
CREATE INDEX idx_audit_target ON mercybridge_audit_logs(target_type, target_id);

-- ============================================================================
-- USER ROLES EXTENSION
-- ============================================================================

-- Add role field to existing profiles table (if not exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS mercybridge_role TEXT DEFAULT 'requester' 
  CHECK (mercybridge_role IN ('requester', 'sponsor', 'reviewer', 'admin'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_anonymous_sponsor BOOLEAN DEFAULT false;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS total_contributed DECIMAL(12, 2) DEFAULT 0;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS needs_helped_count INTEGER DEFAULT 0;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update need funding when contribution is made
CREATE OR REPLACE FUNCTION update_need_funding()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mercybridge_needs
  SET 
    amount_funded = (
      SELECT COALESCE(SUM(amount), 0)
      FROM mercybridge_contributions
      WHERE need_id = NEW.need_id AND status = 'completed'
    ),
    status = CASE
      WHEN amount_funded + NEW.amount >= amount_requested THEN 'funded'
      WHEN amount_funded + NEW.amount > 0 THEN 'partially_funded'
      ELSE status
    END,
    funded_at = CASE
      WHEN amount_funded + NEW.amount >= amount_requested THEN now()
      ELSE funded_at
    END,
    updated_at = now()
  WHERE id = NEW.need_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for contribution updates
CREATE TRIGGER trigger_update_need_funding
AFTER INSERT OR UPDATE ON mercybridge_contributions
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_need_funding();

-- Set submitted_at timestamp
CREATE OR REPLACE FUNCTION set_submitted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND OLD.status = 'draft' THEN
    NEW.submitted_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_submitted_at
BEFORE UPDATE ON mercybridge_needs
FOR EACH ROW
EXECUTE FUNCTION set_submitted_at();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE mercybridge_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_admin_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_stewardship_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_stewardship_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mercybridge_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin/reviewer
CREATE OR REPLACE FUNCTION is_mercybridge_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND mercybridge_role IN ('admin', 'reviewer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- mercybridge_needs policies
CREATE POLICY "needs_select_public" ON mercybridge_needs
  FOR SELECT USING (status = 'approved' OR status = 'partially_funded' OR status = 'funded' OR status = 'paid');

CREATE POLICY "needs_select_own" ON mercybridge_needs
  FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "needs_select_admin" ON mercybridge_needs
  FOR SELECT USING (is_mercybridge_admin());

CREATE POLICY "needs_insert_own" ON mercybridge_needs
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "needs_update_own_draft" ON mercybridge_needs
  FOR UPDATE USING (requester_id = auth.uid() AND status = 'draft')
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "needs_update_admin" ON mercybridge_needs
  FOR UPDATE USING (is_mercybridge_admin());

-- mercybridge_contributions policies
CREATE POLICY "contributions_select_own" ON mercybridge_contributions
  FOR SELECT USING (sponsor_id = auth.uid());

CREATE POLICY "contributions_select_admin" ON mercybridge_contributions
  FOR SELECT USING (is_mercybridge_admin());

CREATE POLICY "contributions_insert_own" ON mercybridge_contributions
  FOR INSERT WITH CHECK (sponsor_id = auth.uid());

-- mercybridge_admin_reviews policies
CREATE POLICY "reviews_select_admin" ON mercybridge_admin_reviews
  FOR SELECT USING (is_mercybridge_admin());

CREATE POLICY "reviews_insert_admin" ON mercybridge_admin_reviews
  FOR INSERT WITH CHECK (is_mercybridge_admin());

-- mercybridge_stewardship_plans policies
CREATE POLICY "plans_select_own" ON mercybridge_stewardship_plans
  FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "plans_insert_own" ON mercybridge_stewardship_plans
  FOR INSERT WITH CHECK (requester_id = auth.uid());

-- mercybridge_stewardship_tasks policies
CREATE POLICY "tasks_select_own" ON mercybridge_stewardship_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mercybridge_stewardship_plans p
      WHERE p.id = plan_id AND p.requester_id = auth.uid()
    )
  );

-- mercybridge_status_updates policies
CREATE POLICY "updates_select_related" ON mercybridge_status_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mercybridge_needs n
      WHERE n.id = need_id 
      AND (n.requester_id = auth.uid() OR is_mercybridge_admin())
    )
  );

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert sample needs for testing
INSERT INTO mercybridge_needs (
  requester_id, title, category, biller_name, bill_amount, amount_requested,
  amount_funded, due_date, urgency_level, status, verification_level,
  hardship_summary_private, hardship_summary_public, public_location,
  private_payment_details, submitted_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'Electric bill - single mom in Michigan',
  'utilities',
  'Consumers Energy',
  184.00,
  184.00,
  92.00,
  '2026-05-15',
  'high',
  'approved',
  'level_3_hardship',
  'Single mother of two facing disconnection after unexpected medical expenses drained emergency fund. Works part-time at local school.',
  'A single mother of two in rural Michigan is facing disconnection after unexpected medical expenses drained her emergency fund.',
  'Michigan',
  'Account: 123456789, Online: consumersenergy.com/pay',
  now() - INTERVAL '3 days'
),
(
  '00000000-0000-0000-0000-000000000002',
  'Rent shortfall - Ohio family',
  'rent_housing',
  'Oakwood Apartments',
  850.00,
  320.00,
  0,
  '2026-05-20',
  'critical',
  'submitted',
  'level_2_identity',
  'Father of three lost hours at factory job. Short $320 on rent after covering emergency car repair. First time unable to make full rent.',
  'A working father of three in Ohio is short on rent after an emergency car repair.',
  'Ohio',
  'Pay online: oakwoodapts.com/pay, Account: Apt 4B',
  now() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000003',
  'Medical bill - elderly couple Texas',
  'medical',
  'Baylor Scott & White',
  450.00,
  450.00,
  200.00,
  '2026-05-30',
  'medium',
  'approved',
  'level_2_identity',
  'Retired couple on fixed income. Husband had emergency gallbladder surgery. Medicare covered most but $450 deductible remains.',
  'A retired couple in Texas faces a $450 medical deductible after emergency surgery.',
  'Texas',
  'Account: 987654321, Mailing address on file',
  now() - INTERVAL '1 day'
);

-- ============================================================================
-- COMPLETE
-- ============================================================================