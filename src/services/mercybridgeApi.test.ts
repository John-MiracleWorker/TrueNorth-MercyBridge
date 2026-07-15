import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const getUser = vi.fn();
  const rpc = vi.fn();
  const upload = vi.fn();
  const createSignedUrl = vi.fn();
  const invoke = vi.fn();
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    single: vi.fn(),
  };
  const from = vi.fn(() => query);

  return { getUser, rpc, upload, createSignedUrl, invoke, from, query };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mocks.from,
    auth: { getUser: mocks.getUser },
    rpc: mocks.rpc,
    storage: {
      from: vi.fn(() => ({
        upload: mocks.upload,
        createSignedUrl: mocks.createSignedUrl,
      })),
    },
    functions: { invoke: mocks.invoke },
  },
}));

import {
  createNeed,
  getAdminNeedById,
  getNeedById,
  markNeedPaid,
  reviewNeed,
  submitAdditionalDocuments,
  submitPaymentProof,
} from './mercybridgeApi';

function resetMocks() {
  mocks.getUser.mockReset();
  mocks.rpc.mockReset();
  mocks.upload.mockReset();
  mocks.createSignedUrl.mockReset();
  mocks.invoke.mockReset();
  mocks.from.mockClear();
  mocks.query.select.mockClear();
  mocks.query.eq.mockClear();
  mocks.query.single.mockReset();
}

describe('MercyBridge need writes', () => {
  beforeEach(resetMocks);

  it('creates a submitted need and its private document metadata atomically', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mocks.rpc.mockResolvedValue({ data: { id: 'need-1', requester_id: 'user-1' }, error: null });

    const result = await createNeed({
      idempotency_key: '00000000-0000-0000-0000-0000000000c0',
      category: 'utilities',
      biller_name: 'Power Company',
      bill_amount: 120,
      amount_requested: 100,
      hardship_summary_private: 'Temporary loss of income',
      hardship_attestation: true,
      urgency_level: 'high',
      requester_consent_ai_review: true,
      requester_consent_human_review: true,
      requester_consent_temp_storage: true,
      requester_consent_no_guarantee: true,
      document_storage_paths: ['user-1/bill.pdf'],
      hardship_document_storage_paths: ['user-1/hardship.pdf'],
    });

    expect(result).toMatchObject({ id: 'need-1', requester_id: 'user-1' });
    expect(mocks.rpc).toHaveBeenCalledOnce();
    expect(mocks.rpc).toHaveBeenCalledWith('mercybridge_create_need', {
      p_idempotency_key: '00000000-0000-0000-0000-0000000000c0',
      p_payload: expect.objectContaining({
        category: 'utilities',
        biller_name: 'Power Company',
        status: 'submitted',
        hardship_attestation: true,
        requester_consent_ai_review: true,
        requester_consent_human_review: true,
        requester_consent_temp_storage: true,
        requester_consent_no_guarantee: true,
      }),
      p_document_paths: ['user-1/bill.pdf'],
      p_hardship_paths: ['user-1/hardship.pdf'],
    });

    expect(mocks.from).not.toHaveBeenCalledWith('mercybridge_needs');
  });

  it('does not misclassify ordinary follow-up uploads as hardship proof', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.rpc.mockResolvedValue({ data: { id: 'need-1' }, error: null });
    mocks.invoke.mockResolvedValue({ data: { status: 'approved' }, error: null });

    await submitAdditionalDocuments({
      need_id: 'need-1',
      files: [new File(['bill'], 'bill.pdf', { type: 'application/pdf' })],
      idempotency_key: '00000000-0000-0000-0000-0000000000d0',
    });

    expect(mocks.upload).toHaveBeenCalledWith(
      'user-1/00000000-0000-0000-0000-0000000000d0-additional-0_bill.pdf',
      expect.any(File),
      { upsert: true },
    );

    expect(mocks.rpc).toHaveBeenCalledWith('mercybridge_submit_additional_documents', {
      p_need_id: 'need-1',
      p_document_paths: [
        'user-1/00000000-0000-0000-0000-0000000000d0-additional-0_bill.pdf',
      ],
      p_hardship_paths: [],
    });
  });

  it('stores payment proof only through the controlled paid-transition RPC', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: null });

    await markNeedPaid('need-1', {
      payment_confirmation_note: 'Paid directly to the utility',
      payment_proof_storage_path: 'admin-1/payment-proof.pdf',
    });

    expect(mocks.rpc).toHaveBeenCalledWith('mercybridge_mark_need_paid', {
      p_need_id: 'need-1',
      p_confirmation_note: 'Paid directly to the utility',
      p_payment_proof_path: 'admin-1/payment-proof.pdf',
    });
  });

  it('submits payment proof with a stable idempotency key and server-controlled disclosure metadata', async () => {
    mocks.invoke.mockResolvedValue({
      data: { contribution: { id: 'contribution-1' } },
      error: null,
    });

    await submitPaymentProof({
      idempotency_key: '00000000-0000-0000-0000-0000000000e0',
      need_id: 'need-1',
      amount: 25,
      proof_storage_path: 'user-1/proof.pdf',
      sponsor_ack_direct_pay: true,
      sponsor_ack_not_tax_deductible: true,
      sponsor_ack_mercybridge_no_custody: true,
      sponsor_ack_no_reversal_guarantee: true,
    });

    expect(mocks.invoke).toHaveBeenCalledWith('mercybridge-submit-proof', {
      body: expect.objectContaining({
        idempotency_key: '00000000-0000-0000-0000-0000000000e0',
        proof_storage_path: 'user-1/proof.pdf',
      }),
    });
    const submittedBody = mocks.invoke.mock.calls[0]?.[1]?.body;
    expect(submittedBody).not.toHaveProperty('sponsor_disclosure_acknowledged_at');
    expect(submittedBody).not.toHaveProperty('sponsor_disclosure_version');
  });

  it('sends the complete reviewed decision through the controlled review RPC', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: null });

    await reviewNeed('need-1', {
      action: 'approved',
      notes: '  verified  ',
      verification_level: 'level_1_document',
      checklist: { biller_verified: true },
      decision_reason: '  evidence matched  ',
      public_summary_approved: '  Utility bill verified  ',
    });

    expect(mocks.rpc).toHaveBeenCalledWith('mercybridge_review_need', {
      p_need_id: 'need-1',
      p_action: 'approved',
      p_notes: 'verified',
      p_rejection_reason: null,
      p_verification_level: 'level_1_document',
      p_checklist: { biller_verified: true },
      p_decision_reason: 'evidence matched',
      p_public_summary: 'Utility bill verified',
    });
  });
});

describe('MercyBridge private document reads', () => {
  beforeEach(resetMocks);

  it('fails closed when an authorized private object cannot be signed', async () => {
    mocks.query.single.mockResolvedValue({ data: { id: 'need-1' }, error: null });
    mocks.rpc.mockResolvedValue({
      data: {
        document_storage_paths: ['user-1/missing.pdf'],
        hardship_document_storage_paths: [],
        payment_proof_storage_path: null,
      },
      error: null,
    });
    mocks.createSignedUrl.mockResolvedValue({ data: null, error: { message: 'Object missing' } });

    await expect(getAdminNeedById('need-1')).rejects.toThrow('Object missing');
    expect(mocks.rpc).toHaveBeenCalledWith('mercybridge_get_need_private_documents', {
      p_need_id: 'need-1',
    });
  });

  it('keeps the deprecated generic read public-safe and never requests private evidence', async () => {
    mocks.query.single.mockResolvedValue({ data: { id: 'need-1', status: 'approved' }, error: null });

    await getNeedById('need-1');

    expect(mocks.from).toHaveBeenCalledWith('mercybridge_public_needs');
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.createSignedUrl).not.toHaveBeenCalled();
  });
});
