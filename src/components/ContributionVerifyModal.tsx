import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ExternalLink, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { verifyContribution } from '@/services/mercybridgeApi';
import type { Contribution } from '@/types/mercybridge';

interface ContributionVerifyModalProps {
  contribution: Contribution | null;
  onClose: () => void;
  onVerified: () => void;
}

function aiStatusClasses(status?: Contribution['ai_verification_status']) {
  switch (status) {
    case 'verified':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'flagged':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    case 'failed':
      return 'border-red-500/30 bg-red-500/10 text-red-300';
    default:
      return 'border-white/10 bg-slate-950/70 text-slate-300';
  }
}

export function ContributionVerifyModal({
  contribution,
  onClose,
  onVerified,
}: ContributionVerifyModalProps) {
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState<'verify' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const aiResult = contribution?.ai_verification_result || null;
  const aiIssues = aiResult?.red_flags || aiResult?.issues || [];

  const submit = async (action: 'verify' | 'reject') => {
    if (!contribution) return;
    if (action === 'reject' && !reason.trim()) {
      setError('Add a rejection reason so the sponsor can correct the proof.');
      return;
    }

    setProcessing(action);
    setError(null);
    try {
      await verifyContribution(contribution.id, action, reason.trim() || undefined);
      onVerified();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AnimatePresence>
      {contribution ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-6 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Verify Direct Payment</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Confirm that this proof shows a donor paid the biller directly.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.08]"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Amount</span>
                <span className="font-semibold text-amber-100">${Number(contribution.amount).toFixed(2)}</span>
              </div>
              {contribution.confirmation_number ? (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Confirmation</span>
                  <span className="text-white">{contribution.confirmation_number}</span>
                </div>
              ) : null}
              {contribution.proof_url ? (
                <a
                  href={contribution.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-100 hover:text-amber-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open proof document
                </a>
              ) : null}
              {contribution.proof_notes ? (
                <p className="rounded-lg bg-slate-950/75 p-3 text-slate-300">{contribution.proof_notes}</p>
              ) : null}
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  AI verification
                </h3>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${aiStatusClasses(contribution.ai_verification_status)}`}>
                  {contribution.ai_verification_status || 'pending'}
                  {typeof contribution.ai_confidence_score === 'number'
                    ? ` - ${contribution.ai_confidence_score}%`
                    : ''}
                </span>
              </div>

              {contribution.ai_verified_at ? (
                <p className="mb-3 text-xs text-slate-500">
                  Ran {new Date(contribution.ai_verified_at).toLocaleString()}
                </p>
              ) : (
                <p className="mb-3 text-xs text-slate-500">AI has not recorded a result yet.</p>
              )}

              {aiResult ? (
                <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  <div>Amount detected: <span className="text-white">{typeof aiResult.amount_detected === 'number' ? `$${aiResult.amount_detected.toFixed(2)}` : 'N/A'}</span></div>
                  <div>Biller detected: <span className="text-white">{aiResult.biller_detected || 'N/A'}</span></div>
                  <div>Date detected: <span className="text-white">{aiResult.date_detected || 'N/A'}</span></div>
                  <div>Requires review: <span className="text-white">{aiResult.requires_review ? 'Yes' : 'No'}</span></div>
                </div>
              ) : null}

              {aiResult?.notes ? (
                <p className="mt-3 rounded-lg bg-slate-950/75 p-3 text-xs text-slate-300">{aiResult.notes}</p>
              ) : null}

              {aiIssues.length > 0 ? (
                <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    AI concerns
                  </p>
                  <ul className="space-y-1 text-xs text-amber-100">
                    {aiIssues.map((issue, index) => (
                      <li key={`${issue}-${index}`}>- {issue}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-white">Rejection reason</label>
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Required only when rejecting"
                className="border-white/10 bg-slate-950/55 text-white"
              />
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1 bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-600"
                disabled={Boolean(processing)}
                onClick={() => submit('verify')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {processing === 'verify' ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500/40 text-red-300 hover:bg-red-500/10"
                disabled={Boolean(processing)}
                onClick={() => submit('reject')}
              >
                {processing === 'reject' ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
