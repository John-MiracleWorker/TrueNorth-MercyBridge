import { supabase } from '@/integrations/supabase/client';
import type {
  Need,
  NeedWithDetails,
  NeedAIScreening,
  PublicNeed,
  Contribution,
  CreateNeedRequest,
  CreateContributionRequest,
  SubmitPaymentProofRequest,
  VerifyContributionRequest,
  ReviewNeedRequest,
  MarkPaidRequest,
  BrowseNeedsFilters,
  StewardshipPlan,
  StewardshipCoachRequest,
  RequesterDashboard,
  SponsorDashboard,
  AdminDashboard,
  StatusUpdate,
  Payee,
  PayeeAlias,
  PayeeCategory,
  PayeeExtractedFields,
  PayeeMatchSuggestion,
  PayeePaymentMethod,
  PayeeVerification,
  PayeeVerificationQueueItem,
  PayeeDirectoryResults,
  PaymentAttempt,
  RiskFlag,
  NeedDocument,
} from '@/types/mercybridge';

const ENABLE_STRIPE = import.meta.env.VITE_MERCYBRIDGE_ENABLE_STRIPE === 'true';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

type SupabaseAny = typeof supabase & {
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => any;
};

const db = supabase as SupabaseAny;

export interface UploadedMercyBridgeDocument {
  url: string;
  path: string;
}

export function isStripeEnabled(): boolean {
  return ENABLE_STRIPE;
}

function isMissingPaymentMethodColumnError(error: { code?: string; message?: string } | null) {
  return Boolean(
    error &&
      (error.code === '42703' ||
        /mercybridge_contributions\.payment_method|payment_method.*does not exist/i.test(
          error.message || ''
      ))
  );
}

async function withSignedProofUrls(contributions: Contribution[]): Promise<Contribution[]> {
  return Promise.all(
    contributions.map(async (contribution) => {
      if (!contribution.proof_storage_path) return contribution;

      const { data, error } = await supabase.storage
        .from('mercybridge-documents')
        .createSignedUrl(contribution.proof_storage_path, 60 * 15);

      if (error || !data?.signedUrl) return contribution;

      return {
        ...contribution,
        proof_url: data.signedUrl,
      };
    })
  );
}

// ============================================================================
// NEEDS
// ============================================================================

export async function createNeed(payload: CreateNeedRequest): Promise<Need> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Not authenticated. Please log in and try again.');
  }

  console.log('Creating need for user:', user.id);

  const { data, error } = await supabase
    .from('mercybridge_needs')
    .insert({
      category: payload.category,
      biller_name: payload.biller_name,
      bill_amount: payload.bill_amount,
      amount_requested: payload.amount_requested,
      due_date: payload.due_date?.trim() || null,
      public_location: payload.public_location?.trim() || null,
      urgency_level: payload.urgency_level,
      hardship_summary_private: payload.hardship_summary_private,
      hardship_attestation: Boolean(payload.hardship_attestation),
      hardship_proof_type: payload.hardship_proof_type || 'none',
      hardship_document_urls: payload.hardship_document_urls || [],
      hardship_document_storage_paths: payload.hardship_document_storage_paths || [],
      hardship_document_retention_until: payload.hardship_document_storage_paths?.length
        ? new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
        : null,
      private_payment_details: payload.private_payment_details?.trim() || null,
      payment_instructions_public: payload.payment_instructions_public?.trim() || null,
      document_urls: payload.document_urls,
      document_storage_paths: payload.document_storage_paths || [],
      title: payload.biller_name,
      requester_id: user.id,
      status: 'submitted',
      verification_level: 'level_1_document',
      // Disclosure & consent
      requester_disclosure_acknowledged_at: payload.requester_disclosure_acknowledged_at || new Date().toISOString(),
      requester_disclosure_version: payload.requester_disclosure_version || 'v1',
      requester_consent_ai_review: Boolean(payload.requester_consent_ai_review),
      requester_consent_human_review: Boolean(payload.requester_consent_human_review),
      requester_consent_temp_storage: Boolean(payload.requester_consent_temp_storage),
      requester_consent_no_guarantee: Boolean(payload.requester_consent_no_guarantee),
      // Document lifecycle
      raw_document_retention_until: payload.document_storage_paths?.length
        ? new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
        : null,
      purge_status: payload.document_storage_paths?.length ? 'pending' : 'not_needed',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message);
  }

  const createdNeed = data as Need;

  // V2 payee-directory bootstrap: preserve document-level intake records and
  // attach high-confidence known payees as reviewer suggestions. This is
  // intentionally assistive, not auto-approval.
  const documentPaths = payload.document_storage_paths || [];
  await Promise.allSettled(
    documentPaths.map((path) =>
      recordNeedDocumentExtraction({
        need_id: createdNeed.id,
        storage_path: path,
        document_type: 'bill',
        extracted_fields: {
          payee_name: payload.biller_name,
          amount_due: payload.bill_amount,
          due_date: payload.due_date || null,
        },
        safe_summary: {
          payee_name: payload.biller_name,
          amount_requested: payload.amount_requested,
          due_date: payload.due_date || null,
        },
        extraction_status: 'pending',
      })
    )
  );

  const matches = await findPayeeMatches(payload.biller_name, 1).catch(() => []);
  const bestMatch = matches[0];
  if (bestMatch?.confidence >= 0.9 && ['limited_verified', 'verified', 'trusted'].includes(bestMatch.verification_status)) {
    return attachPayeeToNeed(createdNeed.id, bestMatch.payee_id, bestMatch.confidence, 'matched').catch(() => createdNeed);
  }
  if (bestMatch?.confidence >= 0.72) {
    return attachPayeeToNeed(createdNeed.id, bestMatch.payee_id, bestMatch.confidence, 'possible_match').catch(() => createdNeed);
  }

  await db
    .from('mercybridge_needs')
    .update({ payee_match_status: 'no_match' })
    .eq('id', createdNeed.id)
    .then(() => undefined, () => undefined);

  return createdNeed;
}

export interface NeedScreeningResponse {
  status: 'approved' | 'rejected' | 'flagged' | 'failed';
  requires_review?: boolean;
  requires_more_info?: boolean;
  requested_document_message?: string | null;
  persistence_warnings?: string[];
  message?: string;
}

export async function screenNeedWithAI(needId: string): Promise<NeedScreeningResponse> {
  const { data, error } = await supabase.functions.invoke('screen-mercybridge-need', {
    body: { need_id: needId },
  });

  if (error) {
    let detail: string | undefined;
    const ctx = (error as { context?: unknown }).context;
    if (ctx instanceof Response) {
      try {
        const body = await ctx.clone().json();
        detail = typeof body?.message === 'string' ? body.message : typeof body?.error === 'string' ? body.error : undefined;
      } catch {
        try {
          detail = await ctx.clone().text();
        } catch {
          detail = undefined;
        }
      }
    }
    const message = detail || error.message || 'Failed to run AI request screening';
    console.error('screenNeedWithAI error:', { message, error });
    throw new Error(message);
  }
  return data as NeedScreeningResponse;
}

export interface SubmitAdditionalDocumentsRequest {
  need_id: string;
  files: File[];
}

export async function submitAdditionalDocuments(
  payload: SubmitAdditionalDocumentsRequest
): Promise<Need> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const uploads = await Promise.all(payload.files.map(file => uploadBillDocument(file)));
  const newDocumentUrls: string[] = uploads.map(u => u.url);
  const newDocumentPaths: string[] = uploads.map(u => u.path);

  const { data: currentNeed, error: fetchError } = await supabase
    .from('mercybridge_needs')
    .select('document_urls, document_storage_paths, hardship_document_urls, hardship_document_storage_paths')
    .eq('id', payload.need_id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const updatedDocumentUrls = [...(currentNeed.document_urls || []), ...newDocumentUrls];
  const updatedDocumentPaths = [...(currentNeed.document_storage_paths || []), ...newDocumentPaths];
  const updatedHardshipUrls = [...(currentNeed.hardship_document_urls || []), ...newDocumentUrls];
  const updatedHardshipPaths = [...(currentNeed.hardship_document_storage_paths || []), ...newDocumentPaths];

  const { data, error } = await supabase
    .from('mercybridge_needs')
    .update({
      document_urls: updatedDocumentUrls,
      document_storage_paths: updatedDocumentPaths,
      hardship_document_urls: updatedHardshipUrls,
      hardship_document_storage_paths: updatedHardshipPaths,
      status: 'submitted',
      review_notes: null,
      ai_screening_status: 'pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.need_id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Re-trigger AI screening in background
  try {
    await screenNeedWithAI(payload.need_id);
  } catch {
    // Non-fatal: admin will still review
  }

  return data as Need;
}

export async function getPublicNeeds(filters?: BrowseNeedsFilters): Promise<PublicNeed[]> {
  let query = supabase
    .from('mercybridge_public_needs')
    .select('*')
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false });

  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.urgency) query = query.eq('urgency_level', filters.urgency);
  if (filters?.location) query = query.ilike('public_location', `%${filters.location}%`);
  if (filters?.min_amount) query = query.gte('amount_remaining', filters.min_amount);
  if (filters?.max_amount) query = query.lte('amount_remaining', filters.max_amount);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((need: Need) => ({
    ...need,
    percent_funded: Math.round((need.amount_funded / need.amount_requested) * 100),
  })) as PublicNeed[];
}

export async function getPublicNeedById(id: string): Promise<PublicNeed | null> {
  const { data, error } = await supabase
    .from('mercybridge_public_needs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as PublicNeed;
}

export async function getRequesterNeedById(id: string): Promise<NeedWithDetails | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .eq('id', id)
    .eq('requester_id', user.id)
    .single();

  if (error) return null;
  return data as unknown as NeedWithDetails;
}

export async function getAdminNeedById(id: string): Promise<NeedWithDetails | null> {
  const { data, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as NeedWithDetails;
}

/** @deprecated Use getPublicNeedById, getRequesterNeedById, or getAdminNeedById instead */
export async function getNeedById(id: string): Promise<NeedWithDetails | null> {
  const { data, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as NeedWithDetails;
}

export async function getRequesterNeeds(): Promise<Need[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Need[];
}

// ============================================================================
// CONTRIBUTIONS
// ============================================================================

/** @deprecated Dormant Stripe path. Direct-pay proof is the Phase 1 flow. */
export async function createPaymentIntent(payload: { need_id: string; amount: number }): Promise<{ clientSecret: string }> {
  if (!ENABLE_STRIPE) throw new Error('Stripe payments are disabled for MercyBridge Phase 1.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('mercybridge-payment-intent', {
    body: payload,
  });

  if (error) throw new Error(error.message || 'Failed to create payment intent');
  return data as { clientSecret: string };
}

/** @deprecated Dormant Stripe/mock path. Use submitPaymentProof instead. */
export async function createContribution(payload: CreateContributionRequest): Promise<Contribution> {
  if (!ENABLE_STRIPE) throw new Error('Stripe contributions are disabled for MercyBridge Phase 1.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mercybridge_contributions')
    .insert({
      ...payload,
      sponsor_id: user.id,
      status: 'pending',
      payment_method: 'stripe',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Contribution;
}

export async function submitPaymentProof(payload: SubmitPaymentProofRequest): Promise<Contribution> {
  const { data, error } = await supabase.functions.invoke('mercybridge-submit-proof', {
    body: payload,
  });

  if (error) throw new Error(error.message || 'Failed to submit payment proof');
  return data.contribution as Contribution;
}

export interface PaymentProofVerificationResponse {
  status: 'verified' | 'flagged' | 'failed';
  confidence?: number;
  verified?: boolean;
  requires_review?: boolean;
  issues?: string[];
  message?: string;
}

export async function verifyPaymentProofContribution(
  contributionId: string
): Promise<PaymentProofVerificationResponse> {
  const { data, error } = await supabase.functions.invoke('verify-payment-proof', {
    body: { contribution_id: contributionId },
  });

  if (error) throw new Error(error.message || 'Failed to run AI verification');
  return data as PaymentProofVerificationResponse;
}

export async function verifyContribution(
  contributionId: string,
  action: VerifyContributionRequest['action'],
  reason?: string
): Promise<Contribution> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  if (!SUPABASE_URL) throw new Error('Missing Supabase URL configuration');

  const response = await fetch(`${SUPABASE_URL}/functions/v1/mercybridge-verify-contribution`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contribution_id: contributionId, action, reason }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Verification failed (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error) message = parsed.error;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data.contribution as Contribution;
}

export async function getMyContributions(): Promise<Contribution[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mercybridge_contributions')
    .select('*, need:mercybridge_needs(*)')
    .eq('sponsor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return withSignedProofUrls((data || []) as Contribution[]);
}

export async function getContributionsForNeed(needId: string): Promise<Contribution[]> {
  const { data, error } = await supabase
    .from('mercybridge_contributions')
    .select('*, sponsor:profiles(id, display_name, first_name, last_name)')
    .eq('need_id', needId)
    .in('status', ['pending', 'completed'])
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return withSignedProofUrls((data || []) as Contribution[]);
}

export async function getStatusUpdatesForNeed(needId: string): Promise<StatusUpdate[]> {
  const { data, error } = await supabase
    .from('mercybridge_status_updates')
    .select('*')
    .eq('need_id', needId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as StatusUpdate[];
}

// ============================================================================
// ADMIN
// ============================================================================

export async function getPendingNeeds(): Promise<Need[]> {
  const { data, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .in('status', ['submitted', 'more_info_needed'])
    .order('submitted_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as Need[];
}

export async function getPendingContributions(): Promise<Contribution[]> {
  const baseQuery = () =>
    supabase
      .from('mercybridge_contributions')
      .select('*, need:mercybridge_needs(*)')
      .eq('status', 'pending');

  const { data, error } = await baseQuery()
    .eq('payment_method', 'direct_pay')
    .order('created_at', { ascending: true });

  if (isMissingPaymentMethodColumnError(error)) {
    const { data: fallbackData, error: fallbackError } = await baseQuery().order('created_at', {
      ascending: true,
    });

    if (fallbackError) throw new Error(fallbackError.message);
    return withSignedProofUrls((fallbackData || []).map((contribution) => ({
      payment_method: 'direct_pay',
      ...contribution,
    })) as Contribution[]);
  }

  if (error) throw new Error(error.message);
  return withSignedProofUrls((data || []) as Contribution[]);
}

export async function reviewNeed(needId: string, review: ReviewNeedRequest): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  const updates: Record<string, unknown> = {
    status: review.action === 'approved' ? 'approved' : review.action === 'rejected' ? 'rejected' : 'more_info_needed',
    reviewer_id: user?.id,
  };

  if (review.verification_level) updates.verification_level = review.verification_level;
  if (review.rejection_reason) updates.rejection_reason = review.rejection_reason;
  if (review.public_summary_approved) updates.hardship_summary_public = review.public_summary_approved;

  const { error } = await supabase
    .from('mercybridge_needs')
    .update(updates)
    .eq('id', needId);

  if (error) throw new Error(error.message);

  // Record admin review with checklist and decision reason
  await supabase.from('mercybridge_admin_reviews').insert({
    need_id: needId,
    reviewer_id: user?.id,
    action: review.action,
    previous_status: 'submitted',
    new_status: updates.status,
    notes: review.notes,
    checklist: review.checklist || {},
    decision_reason: review.decision_reason || review.notes || null,
    public_summary_approved: review.public_summary_approved || null,
  });
}

export interface ManageNeedRequest {
  action: 'archive' | 'hard_delete';
  reason: string;
  purge_documents?: boolean;
}

export interface ManageNeedResponse {
  action: ManageNeedRequest['action'];
  need_id: string;
  status: 'archived' | 'deleted';
  purged_document_count: number;
}

export async function manageNeed(needId: string, payload: ManageNeedRequest): Promise<ManageNeedResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  if (!SUPABASE_URL) throw new Error('Missing Supabase URL configuration');

  const response = await fetch(`${SUPABASE_URL}/functions/v1/mercybridge-manage-need`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      need_id: needId,
      ...payload,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Request failed (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error) message = parsed.error;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  return await response.json() as ManageNeedResponse;
}

export async function markNeedPaid(needId: string, payload: MarkPaidRequest): Promise<void> {
  const { error } = await supabase
    .from('mercybridge_needs')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_confirmation_note: payload.payment_confirmation_note,
      payment_proof_url: payload.payment_proof_url,
    })
    .eq('id', needId);

  if (error) throw new Error(error.message);
}

// ============================================================================
// DASHBOARDS
// ============================================================================

export async function getRequesterDashboard(): Promise<RequesterDashboard> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: needs, error } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .eq('requester_id', user.id);

  if (error) throw new Error(error.message);

  const needIds = (needs || []).map((need: Need) => need.id);

  const { data: plans } = await supabase
    .from('mercybridge_stewardship_plans')
    .select('id')
    .eq('requester_id', user.id);

  const { data: tasks } = needIds.length
    ? await supabase
        .from('mercybridge_stewardship_tasks')
        .select('*, plan:mercybridge_stewardship_plans!inner(requester_id)')
        .eq('status', 'pending')
        .eq('plan.requester_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] };

  const needsList = (needs || []) as Need[];
  const active = needsList.filter(n => ['submitted', 'approved', 'partially_funded'].includes(n.status));
  const funded = needsList.filter(n => n.status === 'funded');
  const paid = needsList.filter(n => n.status === 'paid');

  return {
    active_needs: active,
    funded_needs: funded,
    paid_needs: paid,
    stewardship_plan_count: (plans || []).length,
    pending_tasks: (tasks || []) as RequesterDashboard['pending_tasks'],
    total_raised: needsList.reduce((sum, n) => sum + n.amount_funded, 0),
  };
}

export async function getSponsorDashboard(): Promise<SponsorDashboard> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: contributions, error } = await supabase
    .from('mercybridge_contributions')
    .select('*, need:mercybridge_needs(*)')
    .eq('sponsor_id', user.id);

  if (error) throw new Error(error.message);

  const contribList = await withSignedProofUrls((contributions || []) as Contribution[]);
  const total = contribList.reduce((sum, c) => sum + c.amount, 0);

  return {
    total_contributed: total,
    active_contributions: contribList.filter(c => c.status === 'pending').length,
    needs_helped: new Set(contribList.map(c => c.need_id)).size,
    impact_summary: `You've contributed $${total.toFixed(2)} toward ${new Set(contribList.map(c => c.need_id)).size} needs.`,
    recent_contributions: contribList.slice(0, 10),
  };
}

export async function getNeedAIScreening(needId: string): Promise<NeedAIScreening | null> {
  const { data, error } = await supabase
    .from('mercybridge_need_ai_screenings')
    .select('*')
    .eq('need_id', needId)
    .order('screened_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0] as NeedAIScreening;
}

export async function getNeedAIScreeningsForNeeds(needIds: string[]): Promise<NeedAIScreening[]> {
  if (needIds.length === 0) return [];
  const { data, error } = await supabase
    .from('mercybridge_need_ai_screenings')
    .select('*')
    .in('need_id', needIds)
    .order('screened_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as NeedAIScreening[];
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data: pending } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .in('status', ['submitted', 'more_info_needed']);

  const { data: actionNeeds } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .in('status', ['submitted', 'more_info_needed', 'funded'])
    .order('submitted_at', { ascending: true })
    .limit(8);

  const { data: allNeeds } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .order('submitted_at', { ascending: false });

  const { data: aiScreenings } = await supabase
    .from('mercybridge_need_ai_screenings')
    .select('*')
    .order('screened_at', { ascending: false })
    .limit(10);

  const { data: screenedNeeds } = await supabase
    .from('mercybridge_needs')
    .select('*')
    .not('ai_screening_status', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(10);

  const { data: contributions } = await supabase
    .from('mercybridge_contributions')
    .select('*, need:mercybridge_needs(title, biller_name)')
    .order('created_at', { ascending: false });

  const needsList = (allNeeds || []) as Need[];
  const contribList = await withSignedProofUrls((contributions || []) as Contribution[]);

  return {
    pending_review_count: (pending || []).length,
    needs_today: (actionNeeds || []).slice(0, 8) as Need[],
    recent_needs: needsList.slice(0, 10),
    recent_screened_needs: (screenedNeeds || []) as Need[],
    recent_ai_screenings: (aiScreenings || []) as NeedAIScreening[],
    recent_contributions: contribList.slice(0, 10),
    stats: {
      total_needs_submitted: needsList.length,
      total_needs_approved: needsList.filter(n => n.status === 'approved').length,
      total_funded: needsList.filter(n => n.status === 'funded').length,
      total_paid: needsList.filter(n => n.status === 'paid').length,
      ai_screened_needs: needsList.filter(n => n.ai_screening_status && n.ai_screening_status !== 'pending').length,
      ai_flagged_needs: needsList.filter(n => ['flagged', 'failed'].includes(n.ai_screening_status || '')).length,
      total_contributions: contribList.length,
      average_contribution: contribList.length
        ? contribList.reduce((s, c) => s + c.amount, 0) / contribList.length
        : 0,
    },
  };
}

export async function getMercyBridgeRole(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('mercybridge_role, is_admin')
    .eq('id', user.id)
    .single();

  if (error) return null;
  if (data?.is_admin) return 'admin';
  return data?.mercybridge_role ?? null;
}

// ============================================================================
// AI STEWARDSHIP COACH
// ============================================================================

export async function generateStewardshipPlan(
  needId: string,
  context: StewardshipCoachRequest
): Promise<StewardshipPlan> {
  const { data, error } = await supabase.functions.invoke('mercybridge-stewardship-coach', {
    body: { need_id: needId, context },
  });

  if (error) {
    throw new Error(error.message || 'Failed to generate stewardship plan');
  }

  return data as StewardshipPlan;
}

export interface StewardshipChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StewardshipChatContext {
  monthly_income?: string;
  bills?: string;
  expenses?: string;
  hardship_notes?: string;
  church_community?: string;
}

export interface StewardshipStreamHandlers {
  onTextDelta?: (delta: string, content: string) => void;
  onThinkingDelta?: (delta: string, thinking: string) => void;
  onMetadata?: (metadata: Record<string, unknown>) => void;
  onComplete?: (content: string, thinking: string) => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
}

interface SseRecord {
  event?: string;
  data: string;
}

function parseSseRecord(record: string): SseRecord | null {
  const dataLines: string[] = [];
  let event: string | undefined;

  for (const line of record.split(/\r?\n/)) {
    if (!line || line.startsWith(':')) continue;

    const separatorIndex = line.indexOf(':');
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    let value = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);

    if (value.startsWith(' ')) value = value.slice(1);

    if (field === 'event') {
      event = value;
    } else if (field === 'data') {
      dataLines.push(value);
    }
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join('\n') };
}

function handleStewardshipSseEvent(
  record: SseRecord,
  handlers: StewardshipStreamHandlers
): boolean {
  if (record.data === '[DONE]') return false;

  const parsed = JSON.parse(record.data) as Record<string, unknown>;
  const type = String(parsed.type || record.event || '').toLowerCase();

  if (type === 'metadata') {
    handlers.onMetadata?.(parsed.metadata as Record<string, unknown>);
    return false;
  }

  if (type === 'text_delta') {
    handlers.onTextDelta?.(String(parsed.delta || ''), String(parsed.content || ''));
    return false;
  }

  if (type === 'thinking_delta' || type === 'reasoning_delta') {
    handlers.onThinkingDelta?.(String(parsed.delta || ''), String(parsed.thinking || parsed.content || ''));
    return false;
  }

  if (type === 'complete') {
    handlers.onComplete?.(String(parsed.content || ''), String(parsed.thinking || ''));
    return true;
  }

  if (type === 'error') {
    handlers.onError?.(String(parsed.error || parsed.message || 'Stewardship coach failed'));
    return true;
  }

  return false;
}

export async function loadStewardshipChat(): Promise<{ messages: StewardshipChatMessage[]; context: StewardshipChatContext | null } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('mercybridge_stewardship_chats')
    .select('messages, context')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return {
    messages: data.messages as StewardshipChatMessage[],
    context: data.context as StewardshipChatContext | null,
  };
}

export async function saveStewardshipChat(payload: {
  messages: StewardshipChatMessage[];
  context: StewardshipChatContext | null;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('mercybridge_stewardship_chats')
    .upsert({
      user_id: user.id,
      messages: payload.messages,
      context: payload.context,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  if (error) throw new Error(error.message || 'Failed to save chat history');
}

export async function streamStewardshipCoachMessage(
  payload: {
    message: string;
    context?: StewardshipChatContext;
    conversationHistory?: StewardshipChatMessage[];
  },
  handlers: StewardshipStreamHandlers = {}
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  if (!SUPABASE_URL) throw new Error('Missing Supabase URL configuration');

  const response = await fetch(`${SUPABASE_URL}/functions/v1/mercybridge-stewardship-coach`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: handlers.signal,
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to start stewardship coach stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const records = buffer.split(/\r?\n\r?\n/);
      buffer = records.pop() || '';

      for (const rawRecord of records) {
        const record = parseSseRecord(rawRecord);
        if (!record) continue;

        const shouldStop = handleStewardshipSseEvent(record, handlers);
        if (shouldStop) return;
      }
    }

    if (buffer.trim()) {
      const record = parseSseRecord(buffer);
      if (record) handleStewardshipSseEvent(record, handlers);
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================================================
// UPLOAD
// ============================================================================

export async function uploadBillDocument(file: File): Promise<UploadedMercyBridgeDocument> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const filePath = `${user.id}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('mercybridge-documents')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from('mercybridge-documents')
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

// ============================================================================
// V2 PAYEE DIRECTORY + VERIFICATION WORKFLOW
// ============================================================================



export interface CreatePayeeRequest {
  legal_name: string;
  display_name: string;
  category: PayeeCategory;
  website?: string | null;
  phone?: string | null;
  address?: Record<string, unknown> | null;
  verification_status?: Payee['verification_status'];
  verification_level?: number;
  risk_score?: number;
  trust_score?: number;
  aliases?: string[];
}

export interface UpdatePayeeRequest extends Partial<CreatePayeeRequest> {
  suspension_reason?: string | null;
}

export interface CreatePaymentMethodRequest {
  payee_id: string;
  method_type: PayeePaymentMethod['method_type'];
  payment_url?: string | null;
  mailing_address?: Record<string, unknown> | null;
  check_payable_to?: string | null;
  phone_payment_allowed?: boolean;
  phone?: string | null;
  requires_account_number?: boolean;
  requires_invoice_number?: boolean;
  notes?: string | null;
  status?: PayeePaymentMethod['status'];
}

export interface CreatePaymentAttemptRequest {
  need_id: string;
  payee_id?: string | null;
  payment_method_id?: string | null;
  amount: number;
  method: string;
  status?: PaymentAttempt['status'];
  confirmation_number?: string | null;
  receipt_storage_path?: string | null;
  paid_at?: string | null;
  settled_at?: string | null;
  failed_reason?: string | null;
}

export function normalizePayeeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export async function findPayeeMatches(query: string, limit = 8): Promise<PayeeMatchSuggestion[]> {
  if (!query.trim()) return [];
  const { data, error } = await db.rpc('mercybridge_find_payee_matches', {
    query_text: query,
    result_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data || []) as PayeeMatchSuggestion[];
}

export async function listPayees(options: { query?: string; status?: string; limit?: number } = {}): Promise<Payee[]> {
  let request = db
    .from('mercybridge_payees')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(options.limit || 100);

  if (options.status && options.status !== 'all') {
    request = request.eq('verification_status', options.status);
  }

  if (options.query?.trim()) {
    const q = `%${normalizePayeeText(options.query)}%`;
    request = request.or(`normalized_name.ilike.${q},display_name.ilike.%${options.query}%,legal_name.ilike.%${options.query}%`);
  }

  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return (data || []) as Payee[];
}

export async function getPayeeDetails(payeeId: string): Promise<Payee & {
  aliases: PayeeAlias[];
  payment_methods: PayeePaymentMethod[];
  verifications: PayeeVerification[];
  payment_attempts: PaymentAttempt[];
  risk_flags: RiskFlag[];
}> {
  const [payeeRes, aliasesRes, methodsRes, verificationsRes, attemptsRes, flagsRes] = await Promise.all([
    db.from('mercybridge_payees').select('*').eq('id', payeeId).single(),
    db.from('mercybridge_payee_aliases').select('*').eq('payee_id', payeeId).order('created_at', { ascending: false }),
    db.from('mercybridge_payee_payment_methods').select('*').eq('payee_id', payeeId).order('updated_at', { ascending: false }),
    db.from('mercybridge_payee_verifications').select('*').eq('payee_id', payeeId).order('created_at', { ascending: false }),
    db.from('mercybridge_payment_attempts').select('*').eq('payee_id', payeeId).order('created_at', { ascending: false }).limit(20),
    db.from('mercybridge_risk_flags').select('*').eq('payee_id', payeeId).is('resolved_at', null).order('created_at', { ascending: false }),
  ]);

  const firstError = [payeeRes, aliasesRes, methodsRes, verificationsRes, attemptsRes, flagsRes].find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);

  return {
    ...(payeeRes.data as Payee),
    aliases: (aliasesRes.data || []) as PayeeAlias[],
    payment_methods: (methodsRes.data || []) as PayeePaymentMethod[],
    verifications: (verificationsRes.data || []) as PayeeVerification[],
    payment_attempts: (attemptsRes.data || []) as PaymentAttempt[],
    risk_flags: (flagsRes.data || []) as RiskFlag[],
  };
}

export async function createPayee(payload: CreatePayeeRequest): Promise<Payee> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { aliases = [], ...payeePayload } = payload;
  const { data, error } = await db
    .from('mercybridge_payees')
    .insert({
      ...payeePayload,
      normalized_name: normalizePayeeText(payeePayload.legal_name || payeePayload.display_name),
      created_by: user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const payee = data as Payee;
  const uniqueAliases = Array.from(new Set([payload.display_name, payload.legal_name, ...aliases].filter(Boolean)));
  if (uniqueAliases.length > 0) {
    const { error: aliasError } = await db.from('mercybridge_payee_aliases').insert(
      uniqueAliases.map((alias) => ({ payee_id: payee.id, alias_text: alias, normalized_alias: normalizePayeeText(alias), source: 'admin', confidence: 1 }))
    );
    if (aliasError) throw new Error(aliasError.message);
  }
  return payee;
}

export async function updatePayee(payeeId: string, payload: UpdatePayeeRequest): Promise<Payee> {
  const { aliases, ...payeePayload } = payload;
  const updatePayload: Record<string, unknown> = { ...payeePayload };
  if (payeePayload.legal_name || payeePayload.display_name) {
    updatePayload.normalized_name = normalizePayeeText(String(payeePayload.legal_name || payeePayload.display_name));
  }
  if (payeePayload.verification_status === 'suspended') {
    updatePayload.suspended_at = new Date().toISOString();
  }

  const { data, error } = await db
    .from('mercybridge_payees')
    .update(updatePayload)
    .eq('id', payeeId)
    .select()
    .single();
  if (error) throw new Error(error.message);

  if (aliases?.length) {
    await addPayeeAliases(payeeId, aliases);
  }

  return data as Payee;
}

export async function addPayeeAliases(payeeId: string, aliases: string[], source = 'admin'): Promise<PayeeAlias[]> {
  const uniqueAliases = Array.from(new Set(aliases.map((a) => a.trim()).filter(Boolean)));
  if (uniqueAliases.length === 0) return [];
  const { data, error } = await db
    .from('mercybridge_payee_aliases')
    .upsert(
      uniqueAliases.map((alias) => ({
        payee_id: payeeId,
        alias_text: alias,
        normalized_alias: normalizePayeeText(alias),
        source,
        confidence: 1,
      })),
      { onConflict: 'payee_id,normalized_alias' }
    )
    .select();
  if (error) throw new Error(error.message);
  return (data || []) as PayeeAlias[];
}

export async function attachPayeeToNeed(
  needId: string,
  payeeId: string,
  confidence = 1,
  status: Need['payee_match_status'] = 'matched'
): Promise<Need> {
  const { data, error } = await db
    .from('mercybridge_needs')
    .update({
      payee_id: payeeId,
      payee_match_status: status,
      payee_match_confidence: confidence,
    })
    .eq('id', needId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Need;
}

export async function createPayeeFromNeed(need: Need, category?: PayeeCategory): Promise<Payee> {
  const payee = await createPayee({
    legal_name: need.biller_name,
    display_name: need.biller_name,
    category: category || mapNeedCategoryToPayeeCategory(need.category),
    verification_status: 'pending_review',
    verification_level: 0,
    risk_score: 50,
    trust_score: 0,
    aliases: [need.biller_name],
  });
  await attachPayeeToNeed(need.id, payee.id, 1, 'new_payee_pending');
  return payee;
}

export function mapNeedCategoryToPayeeCategory(category: Need['category']): PayeeCategory {
  switch (category) {
    case 'utilities': return 'utility';
    case 'rent_housing': return 'rent_landlord';
    case 'medical': return 'medical';
    case 'transportation': return 'auto_repair';
    case 'childcare': return 'childcare';
    default: return 'other';
  }
}

export async function recordNeedDocumentExtraction(payload: {
  need_id: string;
  document_type?: string;
  storage_path: string;
  extracted_fields?: PayeeExtractedFields;
  safe_summary?: Record<string, unknown>;
  extraction_confidence?: number | null;
  extraction_status?: NeedDocument['extraction_status'];
}): Promise<NeedDocument> {
  const { data, error } = await db
    .from('mercybridge_need_documents')
    .insert({
      document_type: payload.document_type || 'bill',
      need_id: payload.need_id,
      storage_path: payload.storage_path,
      extracted_fields: payload.extracted_fields || {},
      safe_summary: payload.safe_summary || {},
      extraction_confidence: payload.extraction_confidence ?? null,
      extraction_status: payload.extraction_status || 'completed',
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as NeedDocument;
}

export async function getPayeeVerificationQueue(): Promise<PayeeVerificationQueueItem[]> {
  const { data: needsData, error: needsError } = await db
    .from('mercybridge_needs')
    .select('*')
    .in('status', ['submitted', 'more_info_needed', 'approved', 'funded'])
    .or('payee_match_status.in.(not_checked,possible_match,new_payee_pending,no_match),payee_id.is.null')
    .order('submitted_at', { ascending: false, nullsFirst: false })
    .limit(50);
  if (needsError) throw new Error(needsError.message);

  const needs = (needsData || []) as Need[];
  if (needs.length === 0) return [];

  const needIds = needs.map((n) => n.id);
  const payeeIds = Array.from(new Set(needs.map((n) => n.payee_id).filter(Boolean))) as string[];

  const [documentsRes, flagsRes, payeesRes] = await Promise.all([
    db.from('mercybridge_need_documents').select('*').in('need_id', needIds),
    db.from('mercybridge_risk_flags').select('*').in('need_id', needIds).is('resolved_at', null),
    payeeIds.length ? db.from('mercybridge_payees').select('*').in('id', payeeIds) : Promise.resolve({ data: [], error: null }),
  ]);

  const firstError = [documentsRes, flagsRes, payeesRes].find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);

  const docsByNeed = new Map<string, NeedDocument[]>();
  ((documentsRes.data || []) as NeedDocument[]).forEach((doc) => {
    docsByNeed.set(doc.need_id, [...(docsByNeed.get(doc.need_id) || []), doc]);
  });

  const flagsByNeed = new Map<string, RiskFlag[]>();
  ((flagsRes.data || []) as RiskFlag[]).forEach((flag) => {
    if (!flag.need_id) return;
    flagsByNeed.set(flag.need_id, [...(flagsByNeed.get(flag.need_id) || []), flag]);
  });

  const payeesById = new Map<string, Payee>();
  ((payeesRes.data || []) as Payee[]).forEach((payee) => payeesById.set(payee.id, payee));

  const items = await Promise.all(needs.map(async (need) => ({
    need,
    payee: need.payee_id ? payeesById.get(need.payee_id) || null : null,
    documents: docsByNeed.get(need.id) || [],
    risk_flags: flagsByNeed.get(need.id) || [],
    matches: await findPayeeMatches(need.biller_name, 5).catch(() => []),
  })));

  return items;
}


export async function getPayeeDirectoryResults(): Promise<PayeeDirectoryResults> {
  const [
    payeesRes,
    routesRes,
    documentsRes,
    matchedNeedsRes,
    possibleNeedsRes,
    noMatchNeedsRes,
    riskFlagsRes,
    successfulPaymentsRes,
    failedPaymentsRes,
    recentDocumentsRes,
    recentVerificationsRes,
    recentPaymentsRes,
    recentRiskFlagsRes,
  ] = await Promise.all([
    db.from('mercybridge_payees').select('verification_status'),
    db.from('mercybridge_payee_payment_methods').select('status'),
    db.from('mercybridge_need_documents').select('extraction_status'),
    db.from('mercybridge_needs').select('id').eq('payee_match_status', 'matched'),
    db.from('mercybridge_needs').select('id').eq('payee_match_status', 'possible_match'),
    db.from('mercybridge_needs').select('id').in('payee_match_status', ['not_checked', 'new_payee_pending', 'no_match']),
    db.from('mercybridge_risk_flags').select('id').is('resolved_at', null),
    db.from('mercybridge_payment_attempts').select('id').in('status', ['paid', 'confirmed', 'settled']),
    db.from('mercybridge_payment_attempts').select('id').in('status', ['failed', 'reversed']),
    db.from('mercybridge_need_documents').select('*').order('created_at', { ascending: false }).limit(8),
    db.from('mercybridge_payee_verifications').select('*').order('created_at', { ascending: false }).limit(8),
    db.from('mercybridge_payment_attempts').select('*').order('created_at', { ascending: false }).limit(8),
    db.from('mercybridge_risk_flags').select('*').is('resolved_at', null).order('created_at', { ascending: false }).limit(8),
  ]);

  const responses = [
    payeesRes,
    routesRes,
    documentsRes,
    matchedNeedsRes,
    possibleNeedsRes,
    noMatchNeedsRes,
    riskFlagsRes,
    successfulPaymentsRes,
    failedPaymentsRes,
    recentDocumentsRes,
    recentVerificationsRes,
    recentPaymentsRes,
    recentRiskFlagsRes,
  ];
  const firstError = responses.find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);

  const payees = (payeesRes.data || []) as Pick<Payee, 'verification_status'>[];
  const routes = (routesRes.data || []) as Pick<PayeePaymentMethod, 'status'>[];
  const documents = (documentsRes.data || []) as Pick<NeedDocument, 'extraction_status'>[];

  return {
    total_payees: payees.length,
    trusted_payees: payees.filter((p) => p.verification_status === 'trusted').length,
    verified_payees: payees.filter((p) => ['verified', 'trusted', 'limited_verified'].includes(p.verification_status)).length,
    pending_payees: payees.filter((p) => p.verification_status === 'pending_review' || p.verification_status === 'unverified').length,
    suspended_or_rejected_payees: payees.filter((p) => ['suspended', 'rejected'].includes(p.verification_status)).length,
    payment_routes: routes.length,
    approved_payment_routes: routes.filter((r) => ['approved', 'limited_verified'].includes(r.status)).length,
    captured_documents: documents.length,
    pending_document_extractions: documents.filter((d) => ['pending', 'processing'].includes(d.extraction_status)).length,
    matched_needs: (matchedNeedsRes.data || []).length,
    possible_match_needs: (possibleNeedsRes.data || []).length,
    needs_without_match: (noMatchNeedsRes.data || []).length,
    unresolved_risk_flags: (riskFlagsRes.data || []).length,
    successful_payments: (successfulPaymentsRes.data || []).length,
    failed_payments: (failedPaymentsRes.data || []).length,
    recent_documents: (recentDocumentsRes.data || []) as NeedDocument[],
    recent_verifications: (recentVerificationsRes.data || []) as PayeeVerification[],
    recent_payment_attempts: (recentPaymentsRes.data || []) as PaymentAttempt[],
    recent_risk_flags: (recentRiskFlagsRes.data || []) as RiskFlag[],
  };
}

export async function createPayeeVerification(payload: {
  payee_id: string;
  need_id?: string | null;
  verification_type: string;
  result: PayeeVerification['result'];
  evidence?: Record<string, unknown>;
  notes?: string | null;
}): Promise<PayeeVerification> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await db
    .from('mercybridge_payee_verifications')
    .insert({ ...payload, reviewer_id: user.id, evidence: payload.evidence || {} })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as PayeeVerification;
}

export async function createPayeePaymentMethod(payload: CreatePaymentMethodRequest): Promise<PayeePaymentMethod> {
  const { data, error } = await db
    .from('mercybridge_payee_payment_methods')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as PayeePaymentMethod;
}

export async function createPaymentAttempt(payload: CreatePaymentAttemptRequest): Promise<PaymentAttempt> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await db
    .from('mercybridge_payment_attempts')
    .insert({ ...payload, status: payload.status || 'paid', reviewer_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as PaymentAttempt;
}

export async function createRiskFlag(payload: {
  need_id?: string | null;
  payee_id?: string | null;
  requester_id?: string | null;
  flag_type: string;
  severity: RiskFlag['severity'];
  message: string;
  evidence?: Record<string, unknown>;
}): Promise<RiskFlag> {
  const { data, error } = await db
    .from('mercybridge_risk_flags')
    .insert({ ...payload, evidence: payload.evidence || {} })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as RiskFlag;
}

export async function resolveRiskFlag(flagId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await db
    .from('mercybridge_risk_flags')
    .update({ resolved_at: new Date().toISOString(), resolved_by: user.id })
    .eq('id', flagId);
  if (error) throw new Error(error.message);
}
