import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SafeAuthProvider';
import {
  AlertTriangle,
  Archive,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Heart,
  Loader2,
  Lock,
  MapPin,
  Shield,
  Trash2,
  TrendingUp,
  Info,
  EyeOff,
  Sparkles,
  FileText,
  AlertCircle,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { PaymentInstructions } from '@/components/PaymentInstructions';
import { PaymentModal } from '@/components/PaymentModal';
import { ProofUploadModal } from '@/components/ProofUploadModal';
import { StripeProvider } from '@/components/StripeProvider';
import {
  createPaymentIntent,
  getContributionsForNeed,
  getMercyBridgeRole,
  getNeedById,
  getNeedAIScreening,
  getStatusUpdatesForNeed,
  isStripeEnabled,
  manageNeed,
  submitAdditionalDocuments,
} from '@/services/mercybridgeApi';
import type { Contribution, NeedWithDetails, NeedAIScreening, StatusUpdate } from '@/types/mercybridge';

type ManageAction = 'archive' | 'hard_delete';

const categoryLabels: Record<string, string> = {
  utilities: 'Utilities',
  rent_housing: 'Rent & Housing',
  medical: 'Medical',
  transportation: 'Transportation',
  childcare: 'Childcare',
  food: 'Food',
  other_essentials: 'Other Essentials',
};

const urgencyColors: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-500 text-white',
};

const verificationLabels: Record<string, string> = {
  level_1_document: 'Document Verified',
  level_2_identity: 'Identity Verified',
  level_3_hardship: 'Hardship Verified',
  level_4_community: 'Community Confirmed',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function dollars(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

import { useSafeToast } from '@/hooks/useSafeToast';

export default function NeedDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useSafeToast();
  const [need, setNeed] = useState<NeedWithDetails | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [mercybridgeRole, setMercyBridgeRole] = useState<string | null>(null);
  const [aiScreening, setAiScreening] = useState<NeedAIScreening | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [manageAction, setManageAction] = useState<ManageAction>('archive');
  const [manageReason, setManageReason] = useState('');
  const [purgeDocuments, setPurgeDocuments] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [manageMessage, setManageMessage] = useState<string | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  const stripeEnabled = isStripeEnabled();
  const { user } = useAuth();
  const isRequester = user?.id === need?.requester_id;

  const percentFunded = useMemo(() => {
    if (!need?.amount_requested) return 0;
    return Math.min(100, Math.round((need.amount_funded / need.amount_requested) * 100));
  }, [need]);

  const isMercyBridgeAdmin = mercybridgeRole === 'admin';
  const hasContributionHistory = contributions.length > 0;
  const hardDeleteBlocked =
    hasContributionHistory ||
    ['partially_funded', 'funded', 'payment_pending', 'paid'].includes(need?.status || '');
  const manageReasonIsValid = manageReason.trim().length >= 8;
  const canSubmitManagement =
    isMercyBridgeAdmin &&
    !isManaging &&
    (manageAction === 'archive'
      ? manageReasonIsValid
      : manageAction === 'hard_delete'
        ? !hardDeleteBlocked && deleteConfirm === 'DELETE'
        : false);

  const loadNeed = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [needData, contributionData, updateData] = await Promise.all([
        getNeedById(id),
        getContributionsForNeed(id),
        getStatusUpdatesForNeed(id),
      ]);

      setNeed(needData);
      setContributions(contributionData);
      setUpdates(updateData);
      if (!needData) setError('Need not found.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load this need.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadAiScreening = useCallback(async () => {
    if (!id || !isMercyBridgeAdmin) return;
    try {
      const screening = await getNeedAIScreening(id);
      setAiScreening(screening);
    } catch (err) {
      console.error('Failed to load AI screening:', err);
    }
  }, [id, isMercyBridgeAdmin]);

  useEffect(() => {
    void loadNeed();
  }, [loadNeed]);

  useEffect(() => {
    void loadAiScreening();
  }, [loadAiScreening]);

  useEffect(() => {
    let isMounted = true;

    const loadRole = async () => {
      const role = await getMercyBridgeRole();
      if (isMounted) setMercyBridgeRole(role);
    };

    void loadRole();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUploadComplete = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
    void loadNeed();
  };

  const handleStripeClick = async () => {
    if (!need) return;
    try {
      const response = await createPaymentIntent({
        need_id: need.id,
        amount: Math.round(need.amount_remaining * 100),
      });
      setClientSecret(response.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stripe is not available.');
    }
  };

  const handleManageNeed = async () => {
    if (!need || !canSubmitManagement) return;
    setIsManaging(true);
    setError(null);
    setManageMessage(null);

    try {
      const result = await manageNeed(need.id, {
        action: manageAction,
        reason: manageReason.trim(),
        purge_documents: purgeDocuments,
      });

      const purgedText = result.purged_document_count
        ? ` ${result.purged_document_count} stored document${result.purged_document_count === 1 ? '' : 's'} purged.`
        : '';

      if (result.status === 'deleted') {
        toast({
          title: 'Request permanently deleted',
          description: purgedText,
        });
        setManageMessage(`Request permanently deleted.${purgedText}`);
        setManageReason('');
        setDeleteConfirm('');
        // Stay on page; clear the need from state so UI reflects deletion
        setNeed(null);
        return;
      }

      setManageMessage(`Request archived.${purgedText}`);
      setManageReason('');
      setDeleteConfirm('');
      await loadNeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to manage this request.');
    } finally {
      setIsManaging(false);
    }
  };

  const handleDocFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setDocFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeDocFile = (index: number) => {
    setDocFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDocuments = async () => {
    if (!need || docFiles.length === 0) return;
    setIsSubmittingDocs(true);
    setError(null);
    try {
      await submitAdditionalDocuments({
        need_id: need.id,
        files: docFiles,
      });
      setDocFiles([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      await loadNeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit documents.');
    } finally {
      setIsSubmittingDocs(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[hsl(var(--celestial-text-muted))]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading need...
      </div>
    );
  }

  if (!need) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--celestial-text))]">Need not found</h1>
        <p className="mt-2 text-[hsl(var(--celestial-text-muted))]">{error || 'This request is unavailable.'}</p>
      </div>
    );
  }

  const aiResult = aiScreening?.result;

  return (
    <div className="min-h-screen bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{need.title}</h1>
          <p className="text-lg text-slate-400">Pay the biller directly, then upload proof for verification.</p>
          {need.status === 'archived' ? (
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-slate-300">
              <Archive className="h-4 w-4" />
              Archived request
            </div>
          ) : null}
        </div>

        {/* Public Trust Panel */}
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Trust & Disclosures</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">Not tax-deductible.</strong> This is personal assistance, not a charitable donation.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <Heart className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">Pay biller directly.</strong> MercyBridge never holds or processes funds.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">MercyBridge verifies proof.</strong> Admins confirm payments before updating totals.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <EyeOff className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">Sensitive data redacted.</strong> Account numbers and addresses are never public.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">No cash to requester.</strong> Funds go straight to the biller/provider.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">AI + human review.</strong> Documents are screened by AI and reviewed by admins.</span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-400">Amount Verified</p>
                <p className="text-3xl font-bold text-white">{dollars(need.amount_funded)}</p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-sm text-slate-400">Goal</p>
                <p className="text-3xl font-bold text-white">{dollars(need.amount_requested)}</p>
              </div>
            </div>

            <Progress
              value={percentFunded}
              className="h-4 bg-white/[0.08]"
              indicatorClassName="bg-amber-500 transition-all duration-500"
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-slate-400">{percentFunded}% funded</p>
              <p className="font-medium text-amber-100">{dollars(need.amount_remaining)} remaining</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white">
            <Building2 className="h-4 w-4" />
            {categoryLabels[need.category] || need.category}
          </span>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${urgencyColors[need.urgency_level]}`}>
            <Clock className="h-4 w-4" />
            {need.urgency_level}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-900/30 px-4 py-2 text-sm font-medium text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            {verificationLabels[need.verification_level] || 'Verified'}
          </span>
          {need.due_date ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white">
              <Clock className="h-4 w-4" />
              Due {formatDate(need.due_date)}
            </span>
          ) : null}
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-semibold text-white">About This Need</h2>
          <p className="leading-relaxed text-slate-300">{need.hardship_summary_public || 'A verified need awaiting public summary.'}</p>
          {need.public_location ? (
            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>{need.public_location}</span>
            </div>
          ) : null}
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="h-4 w-4" />
              <span>
                Biller: <span className="font-medium text-white">{need.biller_name}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
            <Shield className="mb-3 h-8 w-8 text-amber-100" />
            <h3 className="mb-1 font-medium text-white">Direct to Biller</h3>
            <p className="text-sm text-slate-400">Funds go from sponsor to biller. MercyBridge never touches the money.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
            <Lock className="mb-3 h-8 w-8 text-green-400" />
            <h3 className="mb-1 font-medium text-white">Verified by Staff</h3>
            <p className="text-sm text-slate-400">Admins verify proof before the funded total changes.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
            <Heart className="mb-3 h-8 w-8 text-rose-400" />
            <h3 className="mb-1 font-medium text-white">Personal Assistance</h3>
            <p className="text-sm text-slate-400">This Phase 1 flow is not tax-deductible.</p>
          </div>
        </div>

        <PaymentInstructions
          billerName={need.biller_name}
          accountNumber={need.payment_instructions_public || undefined}
          amountRemaining={need.amount_remaining}
          onUploadProof={() => setShowProofUpload(true)}
        />

        {stripeEnabled ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Fiscal Sponsor Stripe Path</h2>
            <p className="mb-4 text-sm text-slate-300">
              Visible only when MercyBridge Stripe flags are enabled and pointed to a fiscal sponsor account.
            </p>
            <Button className="bg-amber-200 text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]" onClick={handleStripeClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay with card
            </Button>
          </div>
        ) : null}

        {/* Admin AI Review Panel */}
        {isMercyBridgeAdmin && aiResult && (
          <div className="rounded-2xl border border-amber-500/25 bg-slate-950/40 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-100" />
              <h2 className="text-xl font-semibold text-white">AI Screening Result</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Decision</span>
                  <span className={`font-medium ${aiScreening?.screening_status === 'approved' ? 'text-emerald-400' : aiScreening?.screening_status === 'rejected' ? 'text-red-400' : 'text-amber-100'}`}>
                    {aiScreening?.screening_status || 'pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white">{typeof aiScreening?.score === 'number' ? `${aiScreening.score}%` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Hardship Evidence</span>
                  <span className={`font-medium ${aiResult.hardship_evidence_strength === 'strong' ? 'text-emerald-400' : aiResult.hardship_evidence_strength === 'thin' || aiResult.hardship_evidence_strength === 'missing' ? 'text-amber-100' : 'text-slate-300'}`}>
                    {aiResult.hardship_evidence_strength || 'unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Document is Bill</span>
                  <span className={aiResult.document_is_bill ? 'text-emerald-400' : 'text-red-400'}>
                    {aiResult.document_is_bill ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Bill Matches Form</span>
                  <span className={aiResult.bill_matches_form ? 'text-emerald-400' : 'text-amber-100'}>
                    {aiResult.bill_matches_form ? 'Yes' : 'No / Partial'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {aiResult.extracted_biller && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Extracted Biller</span>
                    <span className="text-white">{aiResult.extracted_biller}</span>
                  </div>
                )}
                {typeof aiResult.extracted_amount === 'number' && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Extracted Amount</span>
                    <span className="text-white">${aiResult.extracted_amount.toFixed(2)}</span>
                  </div>
                )}
                {aiResult.extracted_due_date && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Extracted Due Date</span>
                    <span className="text-white">{aiResult.extracted_due_date}</span>
                  </div>
                )}
                {aiResult.recommended_admin_action && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Recommended Action</span>
                    <span className="text-amber-100 capitalize">{aiResult.recommended_admin_action.replace('_', ' ')}</span>
                  </div>
                )}
                {typeof aiResult.privacy_redactions_detected === 'boolean' && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Redactions Detected</span>
                    <span className={aiResult.privacy_redactions_detected ? 'text-emerald-400' : 'text-amber-100'}>
                      {aiResult.privacy_redactions_detected ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {aiResult.red_flags && aiResult.red_flags.length > 0 && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 backdrop-blur-xl p-3">
                <p className="text-xs font-semibold text-red-300 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Red Flags
                </p>
                <ul className="space-y-1 text-xs text-red-200">
                  {aiResult.red_flags.map((flag, i) => (
                    <li key={i}>• {flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiResult.missing_information && aiResult.missing_information.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-xs font-semibold text-amber-300 mb-1">Missing Information</p>
                <ul className="space-y-1 text-xs text-amber-200">
                  {aiResult.missing_information.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiResult.hardship_summary_safe && (
              <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/60 p-3">
                <p className="text-xs font-semibold text-slate-400 mb-1">Safe Hardship Summary</p>
                <p className="text-xs text-slate-300">{aiResult.hardship_summary_safe}</p>
              </div>
            )}

            {aiResult.admin_notes && (
              <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/60 p-3">
                <p className="text-xs font-semibold text-slate-400 mb-1">AI Admin Notes</p>
                <p className="text-xs text-slate-300">{aiResult.admin_notes}</p>
              </div>
            )}
          </div>
        )}

        {isRequester && need.status === 'more_info_needed' && (
          <div className="rounded-[1.5rem] border border-orange-500/25 bg-orange-500/[0.07] shadow-xl shadow-black/15 backdrop-blur-xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-300" />
              <h2 className="text-lg font-semibold text-white">Additional Documentation Needed</h2>
            </div>
            {need.review_notes && (
              <p className="text-sm text-orange-200/80 mb-4">{need.review_notes}</p>
            )}
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-slate-950/35 p-6 cursor-pointer hover:border-orange-400/40 transition">
                <Upload className="w-6 h-6 text-orange-300" />
                <span className="text-sm text-slate-300">Click to upload documents</span>
                <span className="text-xs text-slate-500">PDF, JPG, PNG, WEBP up to 10MB each (max 5)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={handleDocFileChange} className="hidden" />
              </label>
              {docFiles.length > 0 && (
                <div className="space-y-2">
                  {docFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                      <span className="truncate">{file.name}</span>
                      <button onClick={() => removeDocFile(index)} className="ml-2 text-slate-500 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={handleSubmitDocuments}
                disabled={docFiles.length === 0 || isSubmittingDocs}
                className="w-full bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_32px_rgba(249,115,22,0.16)]"
              >
                {isSubmittingDocs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Submit Additional Documents
              </Button>
            </div>
          </div>
        )}

        {isMercyBridgeAdmin ? (
          <div className="rounded-2xl border border-amber-500/25 bg-slate-950/40 p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Archive className="h-5 w-5 text-amber-100" />
                  Admin Request Management
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Archive bad, duplicate, or resolved requests while keeping an audit trail. Hard delete is reserved for spam or test requests with no sponsor activity.
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {need.status}
              </span>
            </div>

            {manageMessage ? (
              <div className="mt-5 rounded-lg border border-emerald-700 bg-emerald-900/30 p-3 text-sm text-emerald-300">
                {manageMessage}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={`rounded-xl border p-4 text-left transition ${
                  manageAction === 'archive'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-white/10 bg-slate-950/35 hover:border-slate-600'
                }`}
                onClick={() => setManageAction('archive')}
              >
                <Archive className="mb-3 h-5 w-5 text-amber-100" />
                <p className="font-semibold text-white">Archive request</p>
                <p className="mt-1 text-sm text-slate-400">Hide from queues and public views, preserve review history.</p>
              </button>
              <button
                type="button"
                disabled={hardDeleteBlocked}
                className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  manageAction === 'hard_delete'
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-white/10 bg-slate-950/35 hover:border-slate-600'
                }`}
                onClick={() => !hardDeleteBlocked && setManageAction('hard_delete')}
              >
                <Trash2 className="mb-3 h-5 w-5 text-red-400" />
                <p className="font-semibold text-white">Hard delete</p>
                <p className="mt-1 text-sm text-slate-400">Only for spam/test requests with no contribution history.</p>
              </button>
            </div>

            {hardDeleteBlocked ? (
              <div className="mt-4 flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-sm text-amber-100/80">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p>
                  Hard delete is disabled because this request has sponsor activity or a funded/payment status. Archive keeps the financial record intact.
                </p>
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="manage-reason" className="text-sm font-medium text-slate-200">
                  Admin reason
                </label>
                <Textarea
                  id="manage-reason"
                  value={manageReason}
                  onChange={(event) => setManageReason(event.target.value)}
                  placeholder="Duplicate submission, spam, requester asked to remove, test data cleanup..."
                  className="mt-2 border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-600"
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 8 characters. This is stored in the admin audit trail.</p>
              </div>

              <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                <Checkbox
                  checked={purgeDocuments}
                  onCheckedChange={(checked) => setPurgeDocuments(Boolean(checked))}
                  className="mt-0.5 border-slate-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-slate-950"
                />
                <span>
                  Purge uploaded bill and hardship documents from private storage.
                  <span className="mt-1 block text-xs text-slate-500">
                    Recommended for archived requests unless a review record must keep original evidence temporarily.
                  </span>
                </span>
              </label>

              {manageAction === 'hard_delete' ? (
                <div>
                  <label htmlFor="delete-confirm" className="text-sm font-medium text-red-200">
                    Type DELETE to permanently remove this request
                  </label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirm}
                    onChange={(event) => setDeleteConfirm(event.target.value)}
                    className="mt-2 border-red-500/30 bg-slate-950/45 text-slate-100"
                  />
                </div>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="button"
                  disabled={!canSubmitManagement}
                  className={manageAction === 'hard_delete' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-200 text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]'}
                  onClick={handleManageNeed}
                >
                  {isManaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {manageAction === 'hard_delete' ? 'Delete Request' : 'Archive Request'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-emerald-700 bg-emerald-900/30 p-4">
            <p className="font-medium text-emerald-400">Thank you. Payment proof was submitted for admin verification.</p>
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-red-700 bg-red-900/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : null}

        <ProofUploadModal
          isOpen={showProofUpload}
          onClose={() => setShowProofUpload(false)}
          needId={need.id}
          onUploadComplete={handleUploadComplete}
        />

        {stripeEnabled && clientSecret ? (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              amount={Math.round(need.amount_remaining * 100)}
              needTitle={need.title}
              clientSecret={clientSecret}
              onSuccess={loadNeed}
            />
          </StripeProvider>
        ) : null}

        {contributions.length > 0 ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-amber-100" />
              Recent Contributions
            </h2>
            <div className="space-y-3">
              {contributions.map((contrib) => (
                <div key={contrib.id} className="flex items-center justify-between border-b border-white/10 py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                      <Heart className="h-4 w-4 text-amber-100" />
                    </div>
                    <span className="text-slate-300">
                      {contrib.is_anonymous ? 'Anonymous Sponsor' : 'Sponsor'}
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">
                      {contrib.status}
                    </span>
                    {isMercyBridgeAdmin && contrib.ai_verification_status && contrib.ai_verification_status !== 'pending' && (
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${
                        contrib.ai_verification_status === 'verified'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}>
                        AI {contrib.ai_verification_status}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{dollars(contrib.amount)}</p>
                    <p className="text-xs text-slate-500">{formatDate(contrib.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {updates.length > 0 ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">Status Updates</h2>
            <div className="space-y-4">
              {updates.map((update, index) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${update.type === 'funded' ? 'bg-green-500' : 'bg-slate-600'}`} />
                    {index < updates.length - 1 ? <div className="mt-2 h-full w-px bg-white/[0.08]" /> : null}
                  </div>
                  <div className="pb-4">
                    <p className="text-slate-300">{update.message}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(update.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
