/**
 * MercyBridge Platform TypeScript Types
 * Christian direct-bill sponsorship platform
 * Direct-pay bill sponsorship architecture
 */

// ============================================================================
// ENUMS
// ============================================================================

export type NeedCategory =
  | 'utilities'
  | 'rent_housing'
  | 'medical'
  | 'transportation'
  | 'childcare'
  | 'food'
  | 'other_essentials';

export type NeedStatus =
  | 'draft'
  | 'submitted'
  | 'more_info_needed'
  | 'approved'
  | 'partially_funded'
  | 'funded'
  | 'payment_pending'
  | 'paid'
  | 'rejected'
  | 'cancelled'
  | 'archived';

export type VerificationLevel =
  | 'level_1_document'      // Bill document uploaded
  | 'level_2_identity'      // Identity privately verified
  | 'level_3_hardship'      // Hardship documentation reviewed
  | 'level_4_community';    // Community/church reference confirmed

export type HardshipProofType =
  | 'none'
  | 'pay_stub'
  | 'benefits_letter'
  | 'shutoff_notice'
  | 'past_due_notice'
  | 'eviction_or_collections'
  | 'referral_letter'
  | 'bank_statement_redacted'
  | 'other';

export type UrgencyLevel =
  | 'critical'   // Due within 7 days
  | 'high'       // Due within 14 days
  | 'medium'     // Due within 30 days
  | 'low';       // Due beyond 30 days

export type ContributionStatus =
  | 'pending'
  | 'completed'
  | 'refunded'
  | 'failed';

export type PaymentMethod =
  | 'direct_pay'
  | 'stripe';

export type UserRole =
  | 'requester'
  | 'sponsor'
  | 'reviewer'
  | 'admin';

export type StewardshipTaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type PurgeStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'not_needed';

export type PayeeCategory =
  | 'utility'
  | 'rent_landlord'
  | 'property_manager'
  | 'medical'
  | 'dental'
  | 'auto_repair'
  | 'insurance'
  | 'childcare'
  | 'school'
  | 'church_partner'
  | 'government_fee'
  | 'telecom'
  | 'other';

export type PayeeVerificationStatus =
  | 'unverified'
  | 'pending_review'
  | 'limited_verified'
  | 'verified'
  | 'trusted'
  | 'suspended'
  | 'rejected';

export type PayeeMatchStatus =
  | 'not_checked'
  | 'matched'
  | 'possible_match'
  | 'new_payee_pending'
  | 'no_match'
  | 'rejected';

export type DocumentExtractionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reviewed';

export type PaymentAttemptStatus =
  | 'pending'
  | 'initiated'
  | 'paid'
  | 'confirmed'
  | 'settled'
  | 'failed'
  | 'reversed'
  | 'cancelled';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// CORE DATABASE INTERFACES
// ============================================================================

/** A bill help request (formerly "Bill") */
export interface Need {
  id: string;
  requester_id: string;
  title: string;                    // e.g. "Electric bill for single mom in Michigan"
  category: NeedCategory;
  biller_name: string;              // Provider/creditor name
  bill_amount: number;              // Total bill amount
  amount_requested: number;         // Amount they need help with
  amount_funded: number;            // Amount raised so far
  amount_remaining: number;         // Calculated: amount_requested - amount_funded
  due_date: string | null;
  urgency_level: UrgencyLevel;

  // Private fields (never public)
  hardship_summary_private: string; // Full explanation
  hardship_attestation?: boolean | null;
  hardship_proof_type?: HardshipProofType | null;
  hardship_document_urls?: string[] | null;
  hardship_document_storage_paths?: string[] | null;
  hardship_document_retention_until?: string | null;
  hardship_document_purged_at?: string | null;
  private_payment_details: string | null; // Account number, payment instructions
  document_urls: string[];          // Bill documentation uploads
  document_storage_paths?: string[] | null; // Private Storage object paths for AI/admin review

  // Public fields (admin-approved)
  hardship_summary_public: string | null; // Redacted/sanitized version
  public_location: string | null;   // City/state only
  payment_instructions_public: string | null;  // Account number, payment link, or instructions for sponsors

  // Status & verification
  status: NeedStatus;
  verification_level: VerificationLevel;
  payee_id?: string | null;
  payee_match_status?: PayeeMatchStatus | null;
  payee_match_confidence?: number | null;
  payee_risk_score?: number | null;
  payee_review_notes?: string | null;
  submitted_at: string;
  approved_at: string | null;
  funded_at: string | null;
  paid_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;

  // Admin tracking
  reviewer_id: string | null;
  review_notes: string | null;
  payment_confirmation_note: string | null;
  payment_proof_url: string | null; // Legacy; new writes remain null.
  payment_proof_storage_path: string | null; // Private receipt object path

  // AI screening (high-level status only; detailed results are admin-only)
  ai_screening_status?: 'pending' | 'approved' | 'rejected' | 'flagged' | 'failed' | null;

  // Disclosure & consent
  requester_disclosure_acknowledged_at?: string | null;
  requester_disclosure_version?: string | null;
  requester_consent_ai_review?: boolean | null;
  requester_consent_human_review?: boolean | null;
  requester_consent_temp_storage?: boolean | null;
  requester_consent_no_guarantee?: boolean | null;

  // Document lifecycle
  raw_document_retention_until?: string | null;
  raw_document_purged_at?: string | null;
  document_summary_retained?: string | null;
  purge_status?: PurgeStatus | null;

  created_at: string;
  updated_at: string;
}

export interface Payee {
  id: string;
  legal_name: string;
  display_name: string;
  normalized_name: string;
  category: PayeeCategory;
  website: string | null;
  phone: string | null;
  address: Record<string, unknown> | null;
  ein_or_tax_id_encrypted?: string | null;
  verification_status: PayeeVerificationStatus;
  verification_level: number;
  risk_score: number;
  trust_score: number;
  last_verified_at: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayeeAlias {
  id: string;
  payee_id: string;
  alias_text: string;
  normalized_alias: string;
  source: string;
  confidence: number;
  created_at: string;
}

export interface NeedDocument {
  id: string;
  need_id: string;
  document_type: string;
  storage_path: string;
  safe_summary: Record<string, unknown> | null;
  extracted_fields: PayeeExtractedFields | Record<string, unknown> | null;
  extraction_status: DocumentExtractionStatus;
  extraction_confidence: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  retention_until: string | null;
  purged_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayeeExtractedFields {
  payee_name?: string | null;
  amount_due?: number | null;
  minimum_due?: number | null;
  due_date?: string | null;
  account_number_last4?: string | null;
  billing_address?: string | null;
  requester_name_on_bill?: string | null;
  payment_url?: string | null;
  payee_phone?: string | null;
  invoice_number?: string | null;
  service_address?: string | null;
}

export interface PayeeVerification {
  id: string;
  payee_id: string;
  need_id: string | null;
  reviewer_id: string | null;
  verification_type: string;
  result: 'passed' | 'failed' | 'partial' | 'needs_more_info';
  evidence: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

export interface PayeePaymentMethod {
  id: string;
  payee_id: string;
  method_type: 'biller_portal' | 'guest_pay_portal' | 'card_by_phone' | 'mailed_check' | 'ach' | 'wire' | 'manual_other';
  payment_url: string | null;
  mailing_address: Record<string, unknown> | null;
  ach_details_encrypted?: string | null;
  check_payable_to: string | null;
  phone_payment_allowed: boolean;
  phone: string | null;
  requires_account_number: boolean;
  requires_invoice_number: boolean;
  notes: string | null;
  status: 'pending_review' | 'approved' | 'limited_verified' | 'suspended' | 'rejected';
  last_successful_payment_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentAttempt {
  id: string;
  need_id: string;
  payee_id: string | null;
  payment_method_id: string | null;
  amount: number;
  method: string;
  status: PaymentAttemptStatus;
  confirmation_number: string | null;
  receipt_storage_path: string | null;
  paid_at: string | null;
  settled_at: string | null;
  failed_reason: string | null;
  reviewer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiskFlag {
  id: string;
  need_id: string | null;
  payee_id: string | null;
  requester_id: string | null;
  flag_type: string;
  severity: RiskSeverity;
  message: string;
  evidence: Record<string, unknown> | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface PayeeMatchSuggestion {
  payee_id: string;
  display_name: string;
  legal_name: string;
  category: PayeeCategory;
  verification_status: PayeeVerificationStatus;
  verification_level: number;
  trust_score: number;
  risk_score: number;
  matched_alias: string;
  confidence: number;
}

export interface PayeeWithDetails extends Payee {
  aliases?: PayeeAlias[];
  payment_methods?: PayeePaymentMethod[];
  verifications?: PayeeVerification[];
  payment_attempts?: PaymentAttempt[];
  risk_flags?: RiskFlag[];
}

export interface PayeeVerificationQueueItem {
  need: Need;
  payee: Payee | null;
  documents: NeedDocument[];
  risk_flags: RiskFlag[];
  matches: PayeeMatchSuggestion[];
}

export interface PayeeDirectoryResults {
  total_payees: number;
  trusted_payees: number;
  verified_payees: number;
  pending_payees: number;
  suspended_or_rejected_payees: number;
  payment_routes: number;
  approved_payment_routes: number;
  captured_documents: number;
  pending_document_extractions: number;
  matched_needs: number;
  possible_match_needs: number;
  needs_without_match: number;
  unresolved_risk_flags: number;
  successful_payments: number;
  failed_payments: number;
  recent_documents: NeedDocument[];
  recent_verifications: PayeeVerification[];
  recent_payment_attempts: PaymentAttempt[];
  recent_risk_flags: RiskFlag[];
}

export interface AIScreeningResult {
  decision?: 'approve' | 'reject' | 'flag';
  status?: 'approved' | 'rejected' | 'flagged' | 'failed';
  confidence_score?: number;
  requester_risk_score?: number;
  hardship_evidence_strength?: 'strong' | 'moderate' | 'thin' | 'missing';
  hardship_proof_summary?: string | null;
  hardship_raw_documents_purged_at?: string | null;
  requires_more_info?: boolean;
  requested_document_message?: string | null;
  document_is_bill?: boolean;
  bill_matches_form?: boolean;
  extracted_biller?: string | null;
  extracted_amount?: number | null;
  extracted_due_date?: string | null;
  red_flags?: string[];
  reasons?: string[];
  requires_manual_review?: boolean;
  public_summary_suggestion?: string | null;
  admin_notes?: string | null;
  // Reviewer-facing fields (Tightness & Trust Plan)
  document_summary?: string | null;
  hardship_summary_safe?: string | null;
  recommended_admin_action?: 'approve' | 'reject' | 'more_info' | 'flag' | null;
  missing_information?: string[] | null;
  privacy_redactions_detected?: boolean | null;
}

/** Contribution from a sponsor toward a need */
export interface Contribution {
  id: string;
  need_id: string;
  sponsor_id: string;
  amount: number;
  status: ContributionStatus;
  payment_method: PaymentMethod;
  stripe_payment_intent_id: string | null;
  proof_url: string | null;
  proof_storage_path?: string | null;
  confirmation_number: string | null;
  proof_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  fiscal_sponsor_id: string | null;

  // AI verification
  ai_verification_status?: 'pending' | 'verified' | 'flagged' | 'failed' | null;
  ai_confidence_score?: number | null;
  ai_verification_result?: {
    amount_detected?: number;
    biller_detected?: string;
    date_detected?: string;
    is_payment_confirmation?: boolean;
    amount_matches?: boolean;
    biller_matches?: boolean;
    red_flags?: string[];
    issues?: string[];
    confidence_score?: number;
    requires_review?: boolean;
    notes?: string;
  } | null;
  ai_verified_at?: string | null;
  ai_review_queue_reason?: string | null;

  // Admin review
  admin_reviewed_at?: string | null;
  admin_reviewed_by?: string | null;
  admin_review_notes?: string | null;

  // Disclosure
  sponsor_disclosure_acknowledged_at?: string | null;
  sponsor_disclosure_version?: string | null;
  sponsor_ack_direct_pay?: boolean | null;
  sponsor_ack_not_tax_deductible?: boolean | null;
  sponsor_ack_mercybridge_no_custody?: boolean | null;
  sponsor_ack_no_reversal_guarantee?: boolean | null;

  gift_note: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at?: string;
  need?: Need;
}

/** Admin review record */
export interface AdminReview {
  id: string;
  need_id: string;
  reviewer_id: string;
  action: 'approved' | 'rejected' | 'more_info' | 'escalated';
  previous_status: NeedStatus;
  new_status: NeedStatus;
  notes: string | null;
  checklist: ReviewerChecklist | null;
  decision_reason: string | null;
  public_summary_approved: string | null;
  created_at: string;
}

/** Objective reviewer checklist */
export interface ReviewerChecklist {
  bill_legitimacy?: boolean | null;
  bill_form_match?: boolean | null;
  hardship_signal?: boolean | null;
  requester_duplicate_risk?: boolean | null;
  public_summary_safe?: boolean | null;
  payment_instructions_safe?: boolean | null;
  notes?: string | null;
}

/** AI-generated stewardship plan for requester */
export interface StewardshipPlan {
  id: string;
  requester_id: string;
  need_id: string | null;
  generated_at: string;

  // Plan content
  financial_summary: string;
  urgency_ranking: string[];        // Ordered list of bill IDs or titles
  seven_day_action_plan: string[];  // Day-by-day tasks
  hardship_budget_suggestions: string;
  creditor_call_scripts: Record<string, string>; // Key: creditor name, Value: script
  encouragement: string;            // Scripture-grounded encouragement
  scripture_references: string[];

  // Tasks generated from plan
  tasks: StewardshipTask[];

  // Edge function response aliases used by the coach UI.
  summary?: string;
  urgent_bills?: { name: string; amount: number; reason: string }[];
  seven_day_plan?: { day: number; action: string }[];
  creditor_scripts?: Record<string, string>;
  budget_suggestions?: string;
  next_step?: string;
  disclaimer?: string;
}

/** Individual task from stewardship plan */
export interface StewardshipTask {
  id: string;
  plan_id: string;
  title: string;
  description: string;
  status: StewardshipTaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

/** Status update/message sent to requester or sponsor */
export interface StatusUpdate {
  id: string;
  need_id: string;
  user_id: string | null;           // Null = system message
  message: string;
  type: 'progress' | 'funded' | 'paid' | 'review' | 'general';
  created_at: string;
}

/** Audit log for admin actions */
export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_type: 'need' | 'contribution' | 'user' | 'payment';
  target_id: string;
  details: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// USER PROFILE EXTENSION
// ============================================================================

export interface MercyBridgeProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;

  // Requester-specific
  total_needs_submitted: number;
  total_needs_funded: number;
  total_needs_paid: number;

  // Sponsor-specific
  total_contributed: number;
  needs_helped_count: number;
  is_anonymous_sponsor: boolean;

  // Admin
  is_reviewer: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/** Create a new need */
export interface CreateNeedRequest {
  idempotency_key: string;
  category: NeedCategory;
  biller_name: string;
  bill_amount: number;
  amount_requested: number;
  due_date?: string | null;
  hardship_summary_private: string;
  hardship_attestation?: boolean;
  hardship_proof_type?: HardshipProofType;
  hardship_document_urls?: string[];
  hardship_document_storage_paths?: string[];
  private_payment_details?: string;
  payment_instructions_public?: string;
  document_urls?: string[];
  document_storage_paths?: string[];
  public_location?: string;
  urgency_level: UrgencyLevel;
  // Disclosure/consent
  requester_disclosure_acknowledged_at?: string;
  requester_disclosure_version?: string;
  requester_consent_ai_review?: boolean;
  requester_consent_human_review?: boolean;
  requester_consent_temp_storage?: boolean;
  requester_consent_no_guarantee?: boolean;
}

/** Update a need (admin or requester during draft) */
export interface UpdateNeedRequest {
  title?: string;
  category?: NeedCategory;
  biller_name?: string;
  bill_amount?: number;
  amount_requested?: number;
  due_date?: string;
  hardship_summary_private?: string;
  private_payment_details?: string;
  document_urls?: string[];
  hardship_summary_public?: string;
  public_location?: string;
  urgency_level?: UrgencyLevel;
}

/** Admin review action */
export interface ReviewNeedRequest {
  action: 'approved' | 'rejected' | 'more_info';
  notes?: string;
  rejection_reason?: string;
  verification_level?: VerificationLevel;
  checklist?: ReviewerChecklist;
  decision_reason?: string;
  public_summary_approved?: string;
}

/** Create a contribution (dormant Stripe path only) */
export interface CreateContributionRequest {
  need_id: string;
  amount: number;
  gift_note?: string;
  is_anonymous?: boolean;
}

export interface SubmitPaymentProofRequest {
  idempotency_key: string;
  need_id: string;
  amount: number;
  proof_storage_path?: string;
  confirmation_number?: string;
  notes?: string;
  gift_note?: string;
  is_anonymous?: boolean;
  // Sponsor disclosure
  sponsor_ack_direct_pay: boolean;
  sponsor_ack_not_tax_deductible: boolean;
  sponsor_ack_mercybridge_no_custody: boolean;
  sponsor_ack_no_reversal_guarantee: boolean;
}

export interface VerifyContributionRequest {
  action: 'verify' | 'reject';
  reason?: string;
}

/** Mark need as paid (admin) */
export interface MarkPaidRequest {
  payment_confirmation_note: string;
  payment_proof_storage_path?: string;
}

/** Filter options for browsing needs */
export interface BrowseNeedsFilters {
  category?: NeedCategory;
  urgency?: UrgencyLevel;
  verification_level?: VerificationLevel;
  location?: string;         // State or city
  min_amount?: number;
  max_amount?: number;
  sort_by?: 'newest' | 'urgency' | 'amount_remaining' | 'closest_to_funded';
}

// ============================================================================
// COMPOSITE TYPES
// ============================================================================

/** Need with public-safe fields for browsing */
export interface PublicNeed {
  id: string;
  requester_id: string | null;
  title: string;
  category: NeedCategory;
  biller_name: string;
  bill_amount: number;
  amount_requested: number;
  amount_funded: number;
  amount_remaining: number;
  due_date: string | null;
  urgency_level: UrgencyLevel;
  hardship_summary_public: string | null;
  public_location: string | null;
  payment_instructions_public: string | null;
  verification_level: VerificationLevel;
  status: NeedStatus;
  submitted_at: string;
  percent_funded: number;
}

/** Need with full details (for requester or admin) */
export interface NeedWithDetails extends Need {
  requester?: MercyBridgeProfile;
  contributions?: Contribution[];
  stewardship_plan?: StewardshipPlan;
  status_updates?: StatusUpdate[];
  admin_reviews?: AdminReview[];
}

/** Sponsor dashboard summary */
export interface SponsorDashboard {
  total_contributed: number;
  active_contributions: number;
  needs_helped: number;
  impact_summary: string;
  recent_contributions: Contribution[];
}

/** Requester dashboard summary */
export interface RequesterDashboard {
  active_needs: Need[];
  funded_needs: Need[];
  paid_needs: Need[];
  stewardship_plan_count: number;
  pending_tasks: StewardshipTask[];
  total_raised: number;
}

/** Admin dashboard summary */
export interface NeedAIScreening {
  id: string;
  need_id: string;
  screening_status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'failed';
  score: number | null;
  result: AIScreeningResult | null;
  screened_at: string;
  created_at: string;
}

export interface AdminDashboard {
  pending_review_count: number;
  needs_today: Need[];
  recent_needs: Need[];
  recent_screened_needs: Need[];
  recent_ai_screenings: NeedAIScreening[];
  recent_contributions: Contribution[];
  stats: {
    total_needs_submitted: number;
    total_needs_approved: number;
    total_funded: number;
    total_paid: number;
    ai_screened_needs: number;
    ai_flagged_needs: number;
    total_contributions: number;
    average_contribution: number;
  };
}

// ============================================================================
// AI STEWARDSHIP COACH TYPES
// ============================================================================

export interface StewardshipCoachRequest {
  need_id?: string;
  financial_context: {
    monthly_income?: number;
    bills: { name: string; amount: number; due_date?: string }[];
    expenses: { category: string; amount: number }[];
  };
  hardship_notes?: string;
  church_community?: string;
}

export interface StewardshipCoachResponse {
  summary: string;
  urgent_bills: { name: string; amount: number; reason: string }[];
  seven_day_plan: { day: number; action: string }[];
  creditor_scripts: Record<string, string>;
  budget_suggestions: string;
  encouragement: string;
  scripture_references: string[];
  next_step: string;
  disclaimer: string;
}
