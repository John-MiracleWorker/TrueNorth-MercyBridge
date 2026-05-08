import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isStripeEnabled } from '@/services/mercybridgeApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // in cents
  needTitle: string;
  clientSecret: string;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, amount, needTitle, clientSecret, onSuccess }: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isStripeEnabled() || !clientSecret) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/mercybridge/payment-success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed. Please try again.');
    } else {
      onSuccess();
      onClose();
    }

    setIsProcessing(false);
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
            className="w-full max-w-lg mx-4 bg-slate-950/80 border border-white/10 rounded-[1.5rem] backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Secure Payment</h2>
                <p className="text-sm text-slate-400 mt-1">{needTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Amount Display */}
            <div className="px-6 py-4 bg-white/[0.055]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Amount</span>
                <span className="text-2xl font-bold text-amber-100">
                  ${(amount / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Funds go directly to the biller. No cash is transferred to individuals.
              </p>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-white/[0.055] rounded-xl p-4">
                <PaymentElement
                  options={{
                    layout: 'tabs',
                    defaultValues: {
                      billingDetails: {
                        name: '',
                      },
                    },
                  }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Secured by Stripe. Your payment info is encrypted.</span>
              </div>

              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)] font-semibold py-6"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Pay ${(amount / 100).toFixed(2)}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Stripe is reserved for a future fiscal-sponsor path.</span>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
