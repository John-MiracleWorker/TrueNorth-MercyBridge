import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2, Loader2, Sparkles, Info, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSafeToast } from '@/hooks/useSafeToast';
import {
  submitPaymentProof,
  uploadBillDocument,
  verifyPaymentProofContribution,
} from '@/services/mercybridgeApi';

interface ProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  needId: string;
  onUploadComplete: () => void;
}

export function ProofUploadModal({ isOpen, onClose, needId, onUploadComplete }: ProofUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showDisclosures, setShowDisclosures] = useState(true);
  const [ackDirectPay, setAckDirectPay] = useState(false);
  const [ackNotTaxDeductible, setAckNotTaxDeductible] = useState(false);
  const [ackNoCustody, setAckNoCustody] = useState(false);
  const [ackNoReversal, setAckNoReversal] = useState(false);
  const proofSubmissionIdempotencyKey = useRef<string | null>(null);
  const { toast } = useSafeToast();

  const allAcknowledged = ackDirectPay && ackNotTaxDeductible && ackNoCustody && ackNoReversal;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(selected.type)) {
      setError('Allowed types: PNG, JPG, WebP, PDF');
      return;
    }

    setFile(selected);
    setError(null);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter the dollar amount you paid directly to the biller');
      return;
    }

    if (!file && !confirmationNumber.trim()) {
      setError('Please upload a file or provide a confirmation number');
      return;
    }

    if (!allAcknowledged) {
      setError('Please acknowledge all disclosures before submitting.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const submissionKey = proofSubmissionIdempotencyKey.current || crypto.randomUUID();
      proofSubmissionIdempotencyKey.current = submissionKey;
      let proofStoragePath = '';

      if (file) {
        const upload = await uploadBillDocument(file, `${submissionKey}-payment-proof`);
        proofStoragePath = upload.path;
      }

      const contribution = await submitPaymentProof({
        idempotency_key: submissionKey,
        need_id: needId,
        amount: numericAmount,
        proof_storage_path: proofStoragePath || undefined,
        confirmation_number: confirmationNumber.trim() || undefined,
        notes: notes || undefined,
        gift_note: giftNote || undefined,
        is_anonymous: isAnonymous,
        sponsor_ack_direct_pay: ackDirectPay,
        sponsor_ack_not_tax_deductible: ackNotTaxDeductible,
        sponsor_ack_mercybridge_no_custody: ackNoCustody,
        sponsor_ack_no_reversal_guarantee: ackNoReversal,
      });
      proofSubmissionIdempotencyKey.current = null;

      // Trigger AI verification
      setIsVerifying(true);
      let finalVerificationMessage = 'MercyBridge admins will verify the direct payment.';
      setVerificationStatus('AI is analyzing your payment proof...');

      try {
        const verification = await verifyPaymentProofContribution(contribution.id);

        if (verification.status === 'verified') {
          finalVerificationMessage = 'AI verified the payment proof and marked it approved.';
          setVerificationStatus('AI verified - payment approved.');
        } else if (verification.status === 'flagged') {
          finalVerificationMessage = 'AI flagged this proof for admin review.';
          setVerificationStatus('Flagged for admin review.');
        } else {
          finalVerificationMessage = 'AI verification could not confirm, so this proof is queued for admin review.';
          setVerificationStatus('Queued for admin review.');
        }
      } catch (verifyError) {
        console.error('AI verification failed:', verifyError);
        finalVerificationMessage = 'AI verification could not run, so this proof is queued for admin review.';
        setVerificationStatus('Queued for admin review.');
      } finally {
        setIsVerifying(false);
      }

      onUploadComplete();
      toast({
        title: 'Proof submitted',
        description: finalVerificationMessage,
      });
      resetForm();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      toast({ title: 'Proof upload failed', description: message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setConfirmationNumber('');
    setNotes('');
    setGiftNote('');
    setIsAnonymous(true);
    setFile(null);
    setPreview(null);
    setShowDisclosures(true);
    setAckDirectPay(false);
    setAckNotTaxDeductible(false);
    setAckNoCustody(false);
    setAckNoReversal(false);
    setVerificationStatus('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-4 bg-slate-950/80 border border-white/10 rounded-[1.5rem] backdrop-blur-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Upload Payment Proof</h2>
                <p className="text-sm text-slate-400 mt-1">Verify that the bill was paid directly</p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {showDisclosures ? (
              <div className="p-6 space-y-5">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <h3 className="text-sm font-semibold text-amber-200 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Before you upload
                  </h3>
                  <p className="text-xs text-amber-100/80">
                    MercyBridge is a direct-pay platform. You pay the biller directly. MercyBridge never holds or processes the funds. Please confirm the following:
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={ackDirectPay}
                      onChange={(e) => setAckDirectPay(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950/75 text-amber-200"
                    />
                    <span>I paid the biller directly. MercyBridge did not process this payment.</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={ackNotTaxDeductible}
                      onChange={(e) => setAckNotTaxDeductible(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950/75 text-amber-200"
                    />
                    <span>I understand this payment is <strong>not tax-deductible</strong>. It is personal assistance, not a charitable donation.</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={ackNoCustody}
                      onChange={(e) => setAckNoCustody(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950/75 text-amber-200"
                    />
                    <span>I understand MercyBridge never held, received, or routed these funds.</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={ackNoReversal}
                      onChange={(e) => setAckNoReversal(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950/75 text-amber-200"
                    />
                    <span>I understand this payment may not be reversible through MercyBridge. Any refund must be arranged directly with the biller or requester.</span>
                  </label>
                </div>

                <Button
                  type="button"
                  disabled={!allAcknowledged}
                  onClick={() => setShowDisclosures(false)}
                  className="w-full bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)] font-semibold"
                >
                  Continue to Proof Upload
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <button
                  type="button"
                  onClick={() => setShowDisclosures(true)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to disclosures
                </button>

                <div className="space-y-2">
                  <label htmlFor="proof-amount" className="text-sm font-medium text-white">
                    Amount Paid ($)
                  </label>
                  <Input
                    id="proof-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="50.00"
                    className="bg-slate-950/55 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <span className="block text-sm font-medium text-white">
                    Screenshot or Receipt (optional)
                  </span>
                  <label
                    htmlFor="proof-file"
                    className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 ${
                      file
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 hover:border-slate-500 bg-white/[0.04]'
                    }`}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    ) : file ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <FileText className="w-5 h-5" />
                        <span>{file.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-slate-500" />
                        <p className="text-sm text-slate-400">Click to upload screenshot</p>
                        <p className="text-xs text-slate-600">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="proof-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Confirmation Number */}
                <div className="space-y-2">
                  <label htmlFor="confirmation" className="text-sm font-medium text-white">
                    Confirmation Number (required if no screenshot)
                  </label>
                  <input
                    id="confirmation"
                    type="text"
                    value={confirmationNumber}
                    onChange={(e) => setConfirmationNumber(e.target.value)}
                    placeholder="Enter confirmation number from payment"
                    className="w-full px-3 py-2 bg-slate-950/55 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-200/60"
                  />
                  {!file && confirmationNumber.trim().length > 0 && (
                    <p className="text-xs text-amber-300/80 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Confirmation-number-only proofs are queued for manual admin review.
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-white">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details about the payment..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950/55 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-200/60 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gift-note" className="text-sm font-medium text-white">
                    Gift Note (optional)
                  </label>
                  <textarea
                    id="gift-note"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="A short encouragement for the requester..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-950/55 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-200/60 resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(event) => setIsAnonymous(event.target.checked)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  Submit anonymously
                </label>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {isVerifying && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-100 animate-pulse" />
                    <p className="text-sm text-amber-300">{verificationStatus}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || isVerifying}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Payment Proof
                    </span>
                  )}
                </Button>

                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Lock className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <p>
                    By submitting, you confirm that you paid the biller directly. MercyBridge verifies proof only and never holds funds. False claims may result in account suspension.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
