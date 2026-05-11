import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Building2, CheckCircle2, FileText, Link2, Loader2, Plus, Receipt, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  addPayeeAliases,
  attachPayeeToNeed,
  createPayee,
  createPayeeFromNeed,
  createPayeePaymentMethod,
  createPayeeVerification,
  createPaymentAttempt,
  getPayeeDirectoryResults,
  getPayeeVerificationQueue,
  listPayees,
  updatePayee,
} from '@/services/mercybridgeApi';
import type { Need, NeedDocument, Payee, PayeeCategory, PayeeDirectoryResults, PayeeExtractedFields, PayeeVerificationQueueItem } from '@/types/mercybridge';

const payeeCategories: PayeeCategory[] = [
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
  'other',
];

const payeeStatuses: Payee['verification_status'][] = [
  'unverified',
  'pending_review',
  'limited_verified',
  'verified',
  'trusted',
  'suspended',
  'rejected',
];

function formatCategory(value: string) {
  return value.split('_').join(' ');
}

function statusClasses(status: Payee['verification_status']) {
  switch (status) {
    case 'trusted':
      return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200';
    case 'verified':
      return 'border-blue-400/40 bg-blue-400/10 text-blue-200';
    case 'limited_verified':
      return 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200';
    case 'pending_review':
      return 'border-amber-400/40 bg-amber-400/10 text-amber-100';
    case 'suspended':
    case 'rejected':
      return 'border-red-400/40 bg-red-400/10 text-red-200';
    default:
      return 'border-slate-500/40 bg-slate-500/10 text-slate-300';
  }
}

function money(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function asExtractedFields(doc: NeedDocument): PayeeExtractedFields {
  return (doc.extracted_fields || {}) as PayeeExtractedFields;
}

function percent(value?: number | null) {
  if (typeof value !== 'number') return '—';
  return `${Math.round(value * 100)}%`;
}

const emptyForm = {
  display_name: '',
  legal_name: '',
  category: 'utility' as PayeeCategory,
  website: '',
  phone: '',
  aliases: '',
};

export function PayeeDirectoryAdmin() {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [queue, setQueue] = useState<PayeeVerificationQueueItem[]>([]);
  const [results, setResults] = useState<PayeeDirectoryResults | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [payeeRows, queueRows, resultRows] = await Promise.all([
        listPayees({ query, status: statusFilter, limit: 80 }),
        getPayeeVerificationQueue(),
        getPayeeDirectoryResults(),
      ]);
      setPayees(payeeRows);
      setQueue(queueRows);
      setResults(resultRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payee directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const stats = useMemo(() => {
    const trusted = payees.filter((p) => p.verification_status === 'trusted').length;
    const verified = payees.filter((p) => ['verified', 'trusted'].includes(p.verification_status)).length;
    const pending = payees.filter((p) => p.verification_status === 'pending_review').length;
    return { trusted, verified, pending };
  }, [payees]);

  const create = async () => {
    if (!form.display_name.trim() || !form.legal_name.trim()) {
      setError('Display name and legal name are required.');
      return;
    }
    setProcessingId('create-payee');
    try {
      await createPayee({
        display_name: form.display_name.trim(),
        legal_name: form.legal_name.trim(),
        category: form.category,
        website: form.website.trim() || null,
        phone: form.phone.trim() || null,
        verification_status: 'pending_review',
        aliases: form.aliases.split(',').map((a) => a.trim()).filter(Boolean),
      });
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payee');
    } finally {
      setProcessingId(null);
    }
  };

  const approveExistingMatch = async (need: Need, payee: Payee, confidence = 1) => {
    setProcessingId(`${need.id}:${payee.id}`);
    try {
      await attachPayeeToNeed(need.id, payee.id, confidence, confidence >= 0.9 ? 'matched' : 'possible_match');
      await addPayeeAliases(payee.id, [need.biller_name], 'reviewer_match');
      await createPayeeVerification({
        payee_id: payee.id,
        need_id: need.id,
        verification_type: 'document_review',
        result: confidence >= 0.9 ? 'passed' : 'partial',
        notes: notes[need.id] || `Matched need biller “${need.biller_name}” to existing payee “${payee.display_name}”.`,
        evidence: { confidence, source: 'admin_queue' },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve match');
    } finally {
      setProcessingId(null);
    }
  };

  const createPendingPayee = async (need: Need) => {
    setProcessingId(`new:${need.id}`);
    try {
      await createPayeeFromNeed(need);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pending payee');
    } finally {
      setProcessingId(null);
    }
  };

  const setPayeeStatus = async (payee: Payee, status: Payee['verification_status']) => {
    setProcessingId(`status:${payee.id}`);
    try {
      await updatePayee(payee.id, {
        verification_status: status,
        verification_level: status === 'trusted' ? Math.max(payee.verification_level, 4) : status === 'verified' ? Math.max(payee.verification_level, 3) : payee.verification_level,
        trust_score: status === 'trusted' ? Math.max(payee.trust_score, 80) : status === 'verified' ? Math.max(payee.trust_score, 60) : payee.trust_score,
      });
      await createPayeeVerification({
        payee_id: payee.id,
        verification_type: 'admin_status_change',
        result: ['verified', 'trusted', 'limited_verified'].includes(status) ? 'passed' : status === 'rejected' ? 'failed' : 'partial',
        notes: `Payee status changed to ${status}.`,
        evidence: { previous_status: payee.verification_status, new_status: status },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payee');
    } finally {
      setProcessingId(null);
    }
  };

  const addPaymentRoute = async (payee: Payee) => {
    const value = paymentMethod[payee.id]?.trim();
    if (!value) return;
    setProcessingId(`method:${payee.id}`);
    try {
      await createPayeePaymentMethod({
        payee_id: payee.id,
        method_type: value.startsWith('http') ? 'biller_portal' : 'manual_other',
        payment_url: value.startsWith('http') ? value : null,
        notes: value.startsWith('http') ? 'Official or reviewer-approved payment portal.' : value,
        status: 'approved',
        requires_account_number: true,
      });
      setPaymentMethod((prev) => ({ ...prev, [payee.id]: '' }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setProcessingId(null);
    }
  };

  const recordManualPayment = async (item: PayeeVerificationQueueItem) => {
    if (!item.need.payee_id) {
      setError('Attach a payee before recording a payment attempt.');
      return;
    }
    setProcessingId(`payment:${item.need.id}`);
    try {
      await createPaymentAttempt({
        need_id: item.need.id,
        payee_id: item.need.payee_id,
        amount: item.need.amount_funded || item.need.amount_requested,
        method: 'manual_v2_admin',
        status: 'confirmed',
        paid_at: new Date().toISOString(),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment attempt');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-emerald-300" />
          <div>
            <h2 className="font-semibold text-white">V2 Payee Directory</h2>
            <p className="text-xs text-slate-500">Verified payees, reusable aliases, review queue, and manual payment memory.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700" onClick={load}>
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="m-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
      ) : null}

      <div className="grid gap-4 p-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
          <p className="text-2xl font-bold text-white">{payees.length}</p>
          <p className="text-xs text-slate-400">Known payees loaded</p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
          <p className="text-2xl font-bold text-emerald-100">{stats.trusted}</p>
          <p className="text-xs text-emerald-100/70">Trusted</p>
        </div>
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-3">
          <p className="text-2xl font-bold text-blue-100">{stats.verified}</p>
          <p className="text-xs text-blue-100/70">Verified/trusted</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
          <p className="text-2xl font-bold text-amber-100">{queue.length}</p>
          <p className="text-xs text-amber-100/70">Queue items</p>
        </div>
      </div>

      {results ? (
        <div className="px-4 pb-4">
          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-200" />
              <h3 className="font-medium text-white">V2 Results</h3>
              <span className="text-xs text-slate-500">What the biller/payee system has captured so far</span>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                <p className="text-xl font-bold text-white">{results.captured_documents}</p>
                <p className="text-xs text-slate-400">Bill documents captured</p>
                <p className="mt-1 text-[11px] text-slate-500">{results.pending_document_extractions} pending extraction/review</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                <p className="text-xl font-bold text-white">{results.matched_needs}</p>
                <p className="text-xs text-slate-400">Needs matched to payees</p>
                <p className="mt-1 text-[11px] text-amber-100/70">{results.possible_match_needs} possible · {results.needs_without_match} unmatched</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                <p className="text-xl font-bold text-white">{results.approved_payment_routes}/{results.payment_routes}</p>
                <p className="text-xs text-slate-400">Approved payment routes</p>
                <p className="mt-1 text-[11px] text-slate-500">Internal admin-only routes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                <p className="text-xl font-bold text-white">{results.successful_payments}</p>
                <p className="text-xs text-slate-400">Successful payment attempts</p>
                <p className="mt-1 text-[11px] text-red-200/70">{results.failed_payments} failed/reversed · {results.unresolved_risk_flags} risk flags</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <FileText className="h-4 w-4 text-blue-200" /> Recent bill extraction records
                </div>
                <div className="space-y-2">
                  {results.recent_documents.slice(0, 4).map((doc) => {
                    const fields = asExtractedFields(doc);
                    return (
                      <div key={doc.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-200">{fields.payee_name || doc.document_type}</span>
                          <span className="rounded-full border border-slate-600/50 px-2 py-0.5 text-[10px] text-slate-400">{doc.extraction_status}</span>
                        </div>
                        <p className="mt-1 text-slate-500">
                          {fields.amount_due ? `${money(fields.amount_due)} due` : 'Amount not extracted'}
                          {fields.due_date ? ` · due ${new Date(fields.due_date).toLocaleDateString()}` : ''}
                          {fields.account_number_last4 ? ` · acct ••••${fields.account_number_last4}` : ''}
                        </p>
                      </div>
                    );
                  })}
                  {results.recent_documents.length === 0 ? <p className="text-xs text-slate-500">No document extraction records yet.</p> : null}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" /> Recent payee verifications
                </div>
                <div className="space-y-2">
                  {results.recent_verifications.slice(0, 4).map((verification) => (
                    <div key={verification.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-200">{verification.verification_type.split('_').join(' ')}</span>
                        <span className="rounded-full border border-emerald-400/30 px-2 py-0.5 text-[10px] text-emerald-200">{verification.result}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-slate-500">{verification.notes || 'No notes recorded.'}</p>
                    </div>
                  ))}
                  {results.recent_verifications.length === 0 ? <p className="text-xs text-slate-500">No payee verification history yet.</p> : null}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <Receipt className="h-4 w-4 text-amber-100" /> Recent payment attempts
                </div>
                <div className="space-y-2">
                  {results.recent_payment_attempts.slice(0, 4).map((attempt) => (
                    <div key={attempt.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-200">{money(attempt.amount)}</span>
                        <span className="rounded-full border border-slate-600/50 px-2 py-0.5 text-[10px] text-slate-300">{attempt.status}</span>
                      </div>
                      <p className="mt-1 text-slate-500">{attempt.method.split('_').join(' ')}{attempt.paid_at ? ` · ${new Date(attempt.paid_at).toLocaleDateString()}` : ''}</p>
                    </div>
                  ))}
                  {results.recent_payment_attempts.length === 0 ? <p className="text-xs text-slate-500">No payment attempts recorded yet.</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 p-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-100" />
              <h3 className="font-medium text-white">Payee Verification Queue</h3>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 py-8 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading queue...</div>
            ) : queue.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">No payees need verification right now.</p>
            ) : (
              <div className="space-y-3">
                {queue.slice(0, 8).map((item) => (
                  <div key={item.need.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="font-medium text-white">{item.need.biller_name}</h4>
                        <p className="mt-1 text-xs text-slate-400">
                          {money(item.need.amount_requested)} requested · {formatCategory(item.need.category)} · {item.need.payee_match_status || 'not checked'}
                        </p>
                        {item.payee ? (
                          <p className="mt-1 text-xs text-emerald-200">Attached: {item.payee.display_name} · Level {item.payee.verification_level}</p>
                        ) : null}
                        {item.documents.length > 0 ? (
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {item.documents.slice(0, 2).map((doc) => {
                              const fields = asExtractedFields(doc);
                              return (
                                <div key={doc.id} className="rounded-lg border border-blue-300/15 bg-blue-300/[0.055] p-2 text-xs">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-blue-100">Bill capture</span>
                                    <span className="text-blue-100/70">{doc.extraction_status} · {percent(doc.extraction_confidence)}</span>
                                  </div>
                                  <p className="mt-1 text-slate-400">
                                    {fields.payee_name || item.need.biller_name}
                                    {fields.amount_due ? ` · ${money(fields.amount_due)}` : ''}
                                    {fields.due_date ? ` · due ${new Date(fields.due_date).toLocaleDateString()}` : ''}
                                  </p>
                                  {(fields.invoice_number || fields.account_number_last4 || fields.payment_url) ? (
                                    <p className="mt-1 text-slate-500">
                                      {fields.invoice_number ? `Invoice ${fields.invoice_number}` : ''}
                                      {fields.account_number_last4 ? `${fields.invoice_number ? ' · ' : ''}Acct ••••${fields.account_number_last4}` : ''}
                                      {fields.payment_url ? `${fields.invoice_number || fields.account_number_last4 ? ' · ' : ''}Payment URL found` : ''}
                                    </p>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {item.risk_flags.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {item.risk_flags.slice(0, 2).map((flag) => (
                              <p key={flag.id} className="text-xs text-amber-100">⚠ {flag.message}</p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-200 hover:bg-slate-700"
                        disabled={processingId === `new:${item.need.id}`}
                        onClick={() => createPendingPayee(item.need)}
                      >
                        <Plus className="mr-1 h-3 w-3" /> New payee
                      </Button>
                    </div>

                    {item.matches.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-slate-400">Possible matches</p>
                        {item.matches.slice(0, 3).map((match) => (
                          <div key={match.payee_id} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-slate-950/35 p-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm text-white">{match.display_name}</p>
                              <p className="text-xs text-slate-500">
                                {(match.confidence * 100).toFixed(0)}% · {formatCategory(match.category)} · {match.verification_status} · trust {match.trust_score}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-emerald-200 font-semibold text-slate-950 hover:bg-emerald-100"
                              disabled={processingId === `${item.need.id}:${match.payee_id}`}
                              onClick={() => approveExistingMatch(item.need, { id: match.payee_id, display_name: match.display_name } as Payee, match.confidence)}
                            >
                              Approve match
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">No reusable payee match found yet.</p>
                    )}

                    <Textarea
                      value={notes[item.need.id] || ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [item.need.id]: e.target.value }))}
                      placeholder="Reviewer notes for this payee verification..."
                      className="mt-3 border-white/10 bg-slate-950/45 text-xs text-slate-100"
                      rows={2}
                    />

                    {item.need.payee_id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 border-blue-400/50 text-blue-100 hover:bg-blue-400/10"
                        disabled={processingId === `payment:${item.need.id}`}
                        onClick={() => recordManualPayment(item)}
                      >
                        Record confirmed manual payment
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-300" />
              <h3 className="font-medium text-white">Create Payee</h3>
            </div>
            <div className="grid gap-2">
              <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Display name" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <Input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} placeholder="Legal name" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PayeeCategory })} className="h-10 rounded-md border border-white/10 bg-slate-950/45 px-3 text-sm text-slate-100">
                {payeeCategories.map((category) => <option key={category} value={category}>{formatCategory(category)}</option>)}
              </select>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Website" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <Input value={form.aliases} onChange={(e) => setForm({ ...form, aliases: e.target.value })} placeholder="Aliases, comma separated" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <Button disabled={processingId === 'create-payee'} onClick={create} className="bg-emerald-200 font-semibold text-slate-950 hover:bg-emerald-100">
                Create pending payee
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-300" />
              <h3 className="font-medium text-white">Directory</h3>
            </div>
            <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void load(); }} placeholder="Search payees" className="border-white/10 bg-slate-950/45 text-slate-100" />
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700" onClick={load}>Search</Button>
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mb-3 h-10 w-full rounded-md border border-white/10 bg-slate-950/45 px-3 text-sm text-slate-100">
              <option value="all">All statuses</option>
              {payeeStatuses.map((status) => <option key={status} value={status}>{status.split('_').join(' ')}</option>)}
            </select>

            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
              {payees.map((payee) => (
                <div key={payee.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{payee.display_name}</p>
                      <p className="text-xs text-slate-500">{formatCategory(payee.category)} · Level {payee.verification_level} · trust {payee.trust_score} · risk {payee.risk_score}</p>
                      {payee.website ? <p className="mt-1 text-xs text-slate-400"><Link2 className="mr-1 inline h-3 w-3" />{payee.website}</p> : null}
                    </div>
                    <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${statusClasses(payee.verification_status)}`}>{payee.verification_status.split('_').join(' ')}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-100 hover:bg-emerald-500/10" disabled={processingId === `status:${payee.id}`} onClick={() => setPayeeStatus(payee, 'verified')}>
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verify
                    </Button>
                    <Button size="sm" variant="outline" className="border-emerald-300/50 text-emerald-100 hover:bg-emerald-300/10" disabled={processingId === `status:${payee.id}`} onClick={() => setPayeeStatus(payee, 'trusted')}>
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Trust
                    </Button>
                  </div>

                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <Input value={paymentMethod[payee.id] || ''} onChange={(e) => setPaymentMethod((prev) => ({ ...prev, [payee.id]: e.target.value }))} placeholder="Payment URL or internal route note" className="border-white/10 bg-slate-950/45 text-xs text-slate-100" />
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700" disabled={processingId === `method:${payee.id}`} onClick={() => addPaymentRoute(payee)}>
                      Add route
                    </Button>
                  </div>
                </div>
              ))}
              {payees.length === 0 && !loading ? <p className="py-4 text-sm text-slate-400">No payees match that filter.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
