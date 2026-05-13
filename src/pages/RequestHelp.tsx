import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SafeAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronRight,
  ChevronLeft,
  Shield,
  CheckCircle2,
  Upload,
  FileText,
  Heart,
  AlertCircle,
  Info,
  EyeOff,
  Clock,
  Trash2,
  Lock,
  Loader2,
} from 'lucide-react';
import { createNeed, screenNeedWithAI, uploadBillDocument } from '@/services/mercybridgeApi';
import type { CreateNeedRequest, HardshipProofType, NeedCategory, UrgencyLevel } from '@/types/mercybridge';
import { validateFiles } from "../utils/validateFiles";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  category: NeedCategory;
  biller_name: string;
  bill_amount: number;
  amount_requested: number;
  due_date: string;
  public_location: string;
  urgency_level: UrgencyLevel;
  hardship_summary_private: string;
  hardship_attestation: boolean;
  hardship_proof_type: HardshipProofType;
  private_payment_details: string;
  payment_instructions_public: string;
  public_summary: string;
  reference_name: string;
  // Disclosure consents
  consent_ai_review: boolean;
  consent_human_review: boolean;
  consent_temp_storage: boolean;
  consent_no_guarantee: boolean;
}

const CATEGORIES: { value: NeedCategory; label: string }[] = [
  { value: 'utilities', label: 'Utilities (electric, gas, water)' },
  { value: 'rent_housing', label: 'Rent / Housing' },
  { value: 'medical', label: 'Medical Bills' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'food', label: 'Food / Groceries' },
  { value: 'other_essentials', label: 'Other Essentials' },
];

const URGENCY_LEVELS: { value: UrgencyLevel; label: string; description: string }[] = [
  { value: 'critical', label: 'Critical', description: 'Due within 7 days or already overdue' },
  { value: 'high', label: 'High', description: 'Due within 14 days' },
  { value: 'medium', label: 'Medium', description: 'Due within 30 days' },
  { value: 'low', label: 'Low', description: 'Due beyond 30 days' },
];

const HARDSHIP_PROOF_TYPES: { value: HardshipProofType; label: string }[] = [
  { value: 'none', label: 'No additional document' },
  { value: 'pay_stub', label: 'Recent pay statement' },
  { value: 'benefits_letter', label: 'Benefits or unemployment letter' },
  { value: 'shutoff_notice', label: 'Shutoff notice' },
  { value: 'past_due_notice', label: 'Past-due notice' },
  { value: 'eviction_or_collections', label: 'Eviction or collections notice' },
  { value: 'referral_letter', label: 'Church/community referral' },
  { value: 'bank_statement_redacted', label: 'Redacted bank statement' },
  { value: 'other', label: 'Other hardship proof' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_BILL_FILES = 5;
const MAX_HARDSHIP_FILES = 3;
const ALLOWED_BILL_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const ALLOWED_HARDSHIP_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];


export default function RequestHelp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('Your need has been received and is now in the review queue.');
  const [billDocuments, setBillDocuments] = useState<File[]>([]);
  const [hardshipDocuments, setHardshipDocuments] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const { register, handleSubmit: handleRHFSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
    defaultValues: {
      category: undefined,
      biller_name: '',
      bill_amount: undefined,
      amount_requested: undefined,
      due_date: '',
      public_location: '',
      urgency_level: undefined,
      hardship_summary_private: '',
      hardship_attestation: false,
      hardship_proof_type: 'none',
      private_payment_details: '',
      payment_instructions_public: '',
      public_summary: '',
      reference_name: '',
      consent_ai_review: false,
      consent_human_review: false,
      consent_temp_storage: false,
      consent_no_guarantee: false,
    }
  });

  const formData = watch();

  const canAdvance = async (targetStep: Step) => {
    setFileError(null);

    if (step === 1) {
      const ok = await trigger(['category', 'bill_amount', 'amount_requested']);
      if (!ok) return false;
    }
    if (step === 2) {
      const ok = await trigger(['biller_name', 'private_payment_details']);
      if (!ok) return false;
    }
    if (step === 3) {
      const ok = await trigger(['hardship_summary_private', 'hardship_attestation']);
      if (!ok) return false;
    }
    if (step === 4) {
      if (billDocuments.length === 0) {
        setFileError('Please upload at least one bill or payment notice.');
        return false;
      }
      const billErr = validateFiles(billDocuments, ALLOWED_BILL_TYPES, MAX_BILL_FILES, 'Bill document');
      if (billErr) {
        setFileError(billErr);
        return false;
      }
      const hardshipErr = validateFiles(hardshipDocuments, ALLOWED_HARDSHIP_TYPES, MAX_HARDSHIP_FILES, 'Hardship proof');
      if (hardshipErr) {
        setFileError(hardshipErr);
        return false;
      }
    }
    if (step === 5) {
      if (!formData.consent_ai_review || !formData.consent_human_review || !formData.consent_temp_storage || !formData.consent_no_guarantee) {
        return false;
      }
    }

    return true;
  };

  const goToStep = async (targetStep: Step) => {
    if (targetStep > step) {
      const ok = await canAdvance(targetStep);
      if (!ok) return;
    }
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    if (step < 6) {
      await goToStep((step + 1) as Step);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!data.hardship_attestation) {
        alert('Please confirm the hardship attestation before submitting.');
        return;
      }

      if (billDocuments.length === 0) {
        alert('Please upload the bill or payment notice for this request.');
        return;
      }

      const documentUrls: string[] = [];
      const documentStoragePaths: string[] = [];
      for (const doc of billDocuments) {
        const upload = await uploadBillDocument(doc);
        documentUrls.push(upload.url);
        documentStoragePaths.push(upload.path);
      }

      const hardshipDocumentUrls: string[] = [];
      const hardshipDocumentStoragePaths: string[] = [];
      for (const doc of hardshipDocuments) {
        const upload = await uploadBillDocument(doc);
        hardshipDocumentUrls.push(upload.url);
        hardshipDocumentStoragePaths.push(upload.path);
      }

      const now = new Date().toISOString();
      const needPayload: CreateNeedRequest = {
        category: data.category,
        biller_name: data.biller_name,
        bill_amount: data.bill_amount,
        amount_requested: data.amount_requested,
        due_date: data.due_date,
        public_location: data.public_location,
        urgency_level: data.urgency_level,
        hardship_summary_private: data.hardship_summary_private,
        hardship_attestation: data.hardship_attestation,
        hardship_proof_type: data.hardship_proof_type,
        hardship_document_urls: hardshipDocumentUrls,
        hardship_document_storage_paths: hardshipDocumentStoragePaths,
        private_payment_details: data.private_payment_details,
        payment_instructions_public: data.payment_instructions_public,
        document_urls: documentUrls,
        document_storage_paths: documentStoragePaths,
        requester_disclosure_acknowledged_at: now,
        requester_disclosure_version: 'v1',
        requester_consent_ai_review: data.consent_ai_review,
        requester_consent_human_review: data.consent_human_review,
        requester_consent_temp_storage: data.consent_temp_storage,
        requester_consent_no_guarantee: data.consent_no_guarantee,
      };

      const need = await createNeed(needPayload);

      try {
        const screening = await screenNeedWithAI(need.id);
        if (screening.status === 'approved') {
          setSubmittedMessage('AI screening approved your request for sponsorship. MercyBridge admins can still audit the details.');
        } else if (screening.status === 'rejected') {
          setSubmittedMessage('AI screening could not approve this request. Check your dashboard for next steps from MercyBridge.');
        } else if (screening.requires_more_info) {
          setSubmittedMessage(screening.requested_document_message || 'AI screening needs one hardship document before review can continue. Please upload a pay statement, benefits letter, shutoff or past-due notice, eviction or collections notice, referral letter, or redacted bank statement from your dashboard.');
        } else {
          setSubmittedMessage('AI screening flagged this request for manual review. A MercyBridge admin will review the bill and details.');
        }
      } catch (screeningError) {
        console.error('AI screening failed:', screeningError);
        setSubmittedMessage('Your need was submitted, but AI screening could not run. It is queued for manual MercyBridge review.');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to submit: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-transparent py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/[0.055] rounded-2xl border border-white/10 p-8"
          >
            <CheckCircle2 className="w-16 h-16 text-amber-100 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-slate-400 mb-6">
              {submittedMessage}
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]">
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? 'bg-amber-500 text-slate-950' : 'bg-white/[0.08] text-slate-500'}`}>
                {s}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 text-center">
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Biller Info'}
            {step === 3 && 'Your Story'}
            {step === 4 && 'Documents'}
            {step === 5 && 'Consent'}
            {step === 6 && 'Review & Submit'}
          </div>
        </div>

        <form onSubmit={handleRHFSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Basic Info</h2>

              <div>
                <Label id="category-label" className="text-white">Category</Label>
                <div role="group" aria-labelledby="category-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setValue('category', cat.value)}
                      aria-pressed={formData.category === cat.value}
                      className={`p-4 rounded-xl border text-left text-sm ${formData.category === cat.value ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/10 text-slate-300 hover:border-slate-600'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Bill Amount</Label>
                  <Input type="number" step="0.01" {...register('bill_amount', { required: 'Required', valueAsNumber: true })} className="mt-2 bg-white/[0.08] border-white/10 text-white" />
                  {errors.bill_amount && <p className="text-red-400 text-sm mt-1">{errors.bill_amount.message}</p>}
                </div>
                <div>
                  <Label className="text-white">Amount Needed</Label>
                  <Input type="number" step="0.01" {...register('amount_requested', { required: 'Required', valueAsNumber: true })} className="mt-2 bg-white/[0.08] border-white/10 text-white" />
                  {errors.amount_requested && <p className="text-red-400 text-sm mt-1">{errors.amount_requested.message}</p>}
                </div>
              </div>

              <div>
                <Label id="urgency-label" className="text-white">Urgency</Label>
                <div role="group" aria-labelledby="urgency-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {URGENCY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setValue('urgency_level', level.value)}
                      aria-pressed={formData.urgency_level === level.value}
                      className={`p-4 rounded-xl border text-left text-sm ${formData.urgency_level === level.value ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/10 text-slate-300 hover:border-slate-600'}`}
                    >
                      <span className="font-medium">{level.label}</span>
                      <span className="block text-xs text-slate-400 mt-1">{level.description}</span>
                    </button>
                  ))}
                </div>
                {errors.urgency_level && <p className="text-red-400 text-sm mt-1">{errors.urgency_level.message}</p>}
              </div>

              <Button type="button" onClick={() => goToStep(2)} className="bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]">Next</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Biller Info</h2>

              <div>
                <Label className="text-white">Biller Name</Label>
                <Input {...register('biller_name', { required: 'Required' })} className="mt-2 bg-white/[0.08] border-white/10 text-white" placeholder="e.g., Consumers Energy" />
                {errors.biller_name && <p className="text-red-400 text-sm mt-1">{errors.biller_name.message}</p>}
              </div>

              <div>
                <Label className="text-white">Due Date (optional)</Label>
                <Input type="date" {...register('due_date')} className="mt-2 bg-white/[0.08] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white">Public Location (optional)</Label>
                <Input {...register('public_location')} className="mt-2 bg-white/[0.08] border-white/10 text-white" placeholder="City, State" />
                <p className="text-xs text-slate-500 mt-1">Only city/state shown publicly. Never your full address.</p>
              </div>

              <div>
                <Label className="text-white">Payment Details (Private)</Label>
                <Textarea {...register('private_payment_details', { required: 'Required' })} className="mt-2 bg-white/[0.08] border-white/10 text-white" placeholder="Account number, online payment link, or mailing address for the biller" />
                {errors.private_payment_details && <p className="text-red-400 text-sm mt-1">{errors.private_payment_details.message}</p>}
                <p className="text-xs text-slate-500 mt-1">Only admins see this. Sponsors use it to pay the biller directly.</p>
              </div>

              <div>
                <Label className="text-white">Payment Instructions (Public, Optional)</Label>
                <Textarea {...register('payment_instructions_public')} className="mt-2 bg-white/[0.08] border-white/10 text-white" placeholder="Short public instruction, e.g., 'Pay online at consumersenergy.com'" />
                <p className="text-xs text-slate-500 mt-1">This appears on the public need page. Do not include account numbers here.</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(1)} variant="outline" className="border-slate-600">Back</Button>
                <Button type="button" onClick={() => goToStep(3)} className="bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Your Story</h2>
              <div>
                <Label className="text-white">What changed that made this bill hard to cover?</Label>
                <Textarea
                  {...register('hardship_summary_private', {
                    required: 'Required',
                    minLength: { value: 40, message: 'Please share a little more detail so reviewers can understand the hardship.' },
                  })}
                  className="mt-2 bg-white/[0.08] border-white/10 text-white"
                  rows={5}
                  placeholder="Describe your situation. The more detail you provide, the better reviewers can understand your need."
                />
                {errors.hardship_summary_private && <p className="text-red-400 text-sm mt-1">{errors.hardship_summary_private.message}</p>}
              </div>
              <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 text-sm text-slate-300">
                <input
                  type="checkbox"
                  {...register('hardship_attestation', { required: 'Required' })}
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-200"
                />
                <span>I confirm this request is truthful, this bill is mine or my household's responsibility, and I am experiencing financial hardship.</span>
              </label>
              {errors.hardship_attestation && <p className="text-red-400 text-sm">Please confirm before continuing.</p>}
              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(2)} variant="outline">Back</Button>
                <Button type="button" onClick={() => goToStep(4)} className="bg-amber-500">Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Documents</h2>

              <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-amber-100" />
                  <Label className="text-white font-medium">Bill or payment notice (required)</Label>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Upload the actual bill, invoice, or past-due notice. Up to {MAX_BILL_FILES} files. Max 10MB each. PDF, PNG, JPG.
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    setBillDocuments(Array.from(e.target.files || []));
                    setFileError(null);
                  }}
                  className="bg-white/[0.08] border-white/10 text-white"
                />
                {billDocuments.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {billDocuments.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-4 h-4 text-amber-100" />
                  <Label className="text-white font-medium">Optional hardship proof</Label>
                </div>
                <select
                  {...register('hardship_proof_type')}
                  className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-white text-sm"
                >
                  {HARDSHIP_PROOF_TYPES.map((proofType) => (
                    <option key={proofType.value} value={proofType.value}>
                      {proofType.label}
                    </option>
                  ))}
                </select>

                {formData.hardship_proof_type === 'bank_statement_redacted' && (
                  <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                    <p className="text-xs text-amber-200 font-medium mb-1">Redaction guidance</p>
                    <p className="text-xs text-amber-100/80">
                      Before uploading, black out or crop account numbers, routing numbers, full addresses, and unrelated transactions. Only income deposits, low balances, or essential-payment patterns should remain visible.
                    </p>
                  </div>
                )}

                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt"
                  onChange={(e) => {
                    setHardshipDocuments(Array.from(e.target.files || []));
                    setFileError(null);
                  }}
                  className="mt-3 bg-white/[0.08] border-white/10 text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Redact account numbers and unrelated transactions. Raw hardship proof is used for AI review and then removed from MercyBridge storage within 72 hours.
                </p>
                {hardshipDocuments.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {hardshipDocuments.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {fileError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 backdrop-blur-xl p-3 text-sm text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {fileError}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(3)} variant="outline">Back</Button>
                <Button type="button" onClick={() => goToStep(5)} className="bg-amber-500">Next</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Consent & Disclosures</h2>
              <p className="text-sm text-slate-400">
                Before submitting, please confirm you understand how MercyBridge handles your request and data.
              </p>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    {...register('consent_ai_review', { required: true })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-200"
                  />
                  <span>I consent to AI review of my uploaded documents to verify bill details and hardship signals.</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    {...register('consent_human_review', { required: true })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-200"
                  />
                  <span>I consent to human admin review of my documents and hardship narrative.</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    {...register('consent_temp_storage', { required: true })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-200"
                  />
                  <span>I understand uploaded documents are stored temporarily for review and raw hardship files are deleted within 72 hours after AI extraction.</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    {...register('consent_no_guarantee', { required: true })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-200"
                  />
                  <span>I understand there is no guarantee of approval or funding. MercyBridge only connects requesters with potential sponsors.</span>
                </label>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                  <p>MercyBridge does not process, hold, or route money. If approved, sponsors pay the biller directly.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <Lock className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                  <p>Your full name, address, and account numbers are never shown publicly.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <Trash2 className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                  <p>Raw hardship documents are purged after AI screening. Only summaries and audit metadata remain.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(4)} variant="outline">Back</Button>
                <Button type="button" onClick={() => goToStep(6)} className="bg-amber-500">Next</Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Review & Confirm</h2>

              <div className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Biller</span>
                  <span className="text-white font-medium">{formData.biller_name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Category</span>
                  <span className="text-white font-medium capitalize">{formData.category?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Bill Amount</span>
                  <span className="text-white font-medium">${Number(formData.bill_amount).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Amount Requested</span>
                  <span className="text-amber-100 font-bold">${Number(formData.amount_requested).toFixed(2)}</span>
                </div>
                {formData.due_date && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-slate-400 text-sm">Due Date</span>
                    <span className="text-white font-medium">{formData.due_date}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Urgency</span>
                  <span className="text-white font-medium capitalize">{formData.urgency_level}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Bill Documents</span>
                  <span className="text-white font-medium">{billDocuments.length} file(s)</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400 text-sm">Hardship Proof</span>
                  <span className="text-white font-medium">
                    {formData.hardship_proof_type === 'none' ? 'Not provided' : `${hardshipDocuments.length} file(s) (${formData.hardship_proof_type?.replace('_', ' ')})`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Hardship Evidence</span>
                  <span className={`font-medium ${formData.hardship_summary_private.length > 150 ? 'text-emerald-400' : 'text-amber-100'}`}>
                    {formData.hardship_summary_private.length > 150 ? 'Strong narrative' : 'Thin narrative'}
                  </span>
                </div>
              </div>

              {formData.hardship_summary_private.length < 150 && hardshipDocuments.length === 0 && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>Your hardship narrative is brief and you have not uploaded hardship proof. AI screening may request more information before approval.</p>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4 space-y-2">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  After submission, AI screening typically takes under a minute.
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  A human admin will still review before your need goes public.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(5)} variant="outline">Back</Button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)] px-6 py-3 rounded-lg font-medium disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
