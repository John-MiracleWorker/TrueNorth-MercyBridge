import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Upload, CheckCircle2, Copy, Check, Info, Heart, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBillerPortal, generatePaymentInstructions } from '@/lib/billerPortals';

interface PaymentInstructionsProps {
  billerName: string;
  accountNumber?: string;
  amountRemaining: number;
  onUploadProof: () => void;
}

export function PaymentInstructions({
  billerName,
  accountNumber,
  amountRemaining,
  onUploadProof,
}: PaymentInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const portal = getBillerPortal(billerName);
  const instructions = generatePaymentInstructions({
    biller_name: billerName,
    account_number: accountNumber,
    amount_remaining: amountRemaining,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/75 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Direct Payment Instructions</h2>
          <p className="text-sm text-slate-400">Pay the biller directly. MercyBridge never handles money.</p>
        </div>
      </div>

      {/* Trust Panel */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur-xl p-4 space-y-2">
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p><strong className="text-slate-300">Not tax-deductible.</strong> This is personal assistance, not a charitable donation.</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Heart className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p><strong className="text-slate-300">Pay biller directly.</strong> MercyBridge never holds or processes funds.</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p><strong className="text-slate-300">No cash to requester.</strong> Funds go straight to the biller/provider.</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <EyeOff className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p><strong className="text-slate-300">Sensitive data redacted.</strong> Account numbers and addresses are never public.</p>
        </div>
      </div>

      {/* Biller Info */}
      <div className="bg-white/[0.055] rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Biller</span>
          <span className="text-white font-medium">{portal.name}</span>
        </div>
        
        {accountNumber ? (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">{portal.fields?.accountNumberLabel || 'Account / Reference'}</span>
            <code className="bg-slate-700 px-2 py-1 rounded text-amber-100 font-mono text-sm">
              {accountNumber}
            </code>
          </div>
        ) : null}
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Amount Due</span>
          <span className="text-amber-100 font-bold text-lg">
            ${amountRemaining.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Link */}
      {portal.paymentUrl && (
        <a
          href={portal.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Pay {portal.name} Directly
        </a>
      )}

      {/* Instructions */}
      <div className="bg-white/[0.04] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-white">Payment Instructions</h3>
          <button
            onClick={handleCopy}
            aria-label="Copy payment instructions"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
          {instructions}
        </pre>
      </div>

      {/* Upload Proof */}
      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          Already Paid? Upload Proof
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          After paying the biller, upload a screenshot, confirmation email, or confirmation number 
          to verify the payment was made.
        </p>
        <Button
          onClick={onUploadProof}
          className="w-full bg-white/[0.08] hover:bg-slate-700 text-white border border-slate-600"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Payment Proof
        </Button>
      </div>

      {/* Trust Note */}
      <div className="flex items-start gap-2 text-xs text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>
          MercyBridge does not process or hold payments. All funds go directly from sponsors 
          to billers. We only verify that payments were made. This is not tax-deductible.
        </p>
      </div>
    </motion.div>
  );
}
