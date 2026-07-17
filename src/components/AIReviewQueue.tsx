import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Eye,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Contribution } from "@/types/mercybridge";

interface AIReviewQueueProps {
  flaggedContributions: Contribution[];
  onApprove: (contribution: Contribution) => Promise<void>;
  onReject: (contribution: Contribution, reason: string) => Promise<void>;
  loading: boolean;
}

export function AIReviewQueue({
  flaggedContributions,
  onApprove,
  onReject,
  loading,
}: AIReviewQueueProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (flaggedContributions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
        <h3 className="mt-4 text-lg font-semibold text-white">
          All Caught Up!
        </h3>
        <p className="mt-2 text-slate-400">
          No contributions need manual review. AI is handling verification.
        </p>
      </motion.div>
    );
  }

  const handleApprove = async (contribution: Contribution) => {
    setProcessingId(contribution.id);
    try {
      await onApprove(contribution);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (contribution: Contribution) => {
    setProcessingId(contribution.id);
    try {
      await onReject(contribution, "Admin manually rejected after AI flag");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-100" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI-Flagged for Review
            </h3>
            <p className="text-xs text-slate-400">
              {flaggedContributions.length} contribution
              {flaggedContributions.length !== 1 ? "s" : ""} need
              {flaggedContributions.length !== 1 ? "" : "s"} manual review
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {flaggedContributions.map((contribution, index) => {
          const aiResult = contribution.ai_verification_result || {};
          const confidence = contribution.ai_confidence_score || 0;
          const issues = aiResult.issues || [];
          const requiresReview = aiResult.requires_review || false;

          return (
            <motion.div
              key={contribution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-amber-500/20 bg-slate-950/75 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-medium">
                      ${Number(contribution.amount || 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">
                      for Need #{contribution.need_id?.slice(0, 8)}
                    </span>
                    {confidence > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          confidence >= 70
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-100"
                        }`}
                      >
                        {confidence}% confidence
                      </span>
                    )}
                  </div>

                  {issues.length > 0 ? (
                    <div className="flex items-start gap-2 text-xs text-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{issues[0]}</span>
                      {issues.length > 1 && (
                        <span className="text-slate-500">
                          +{issues.length - 1} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Flagged for manual review</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedId(
                        expandedId === contribution.id ? null : contribution.id,
                      )
                    }
                    className="border-white/10 text-slate-300 hover:bg-white/[0.08]"
                    aria-expanded={expandedId === contribution.id}
                    aria-controls={`ai-details-${contribution.id}`}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    {expandedId === contribution.id ? "Hide" : "Details"}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === contribution.id && (
                <div
                  id={`ai-details-${contribution.id}`}
                  className="border-t border-slate-800 p-4 space-y-4 bg-slate-950/30"
                >
                  {/* AI Analysis */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      AI Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">Amount Detected:</span>
                        <span className="text-white ml-2">
                          ${aiResult.amount_detected?.toFixed(2) || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected:</span>
                        <span className="text-white ml-2">
                          ${Number(contribution.amount).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Biller:</span>
                        <span className="text-white ml-2">
                          {aiResult.biller_detected || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Date:</span>
                        <span className="text-white ml-2">
                          {aiResult.date_detected || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Red Flags
                      </h4>
                      <ul className="space-y-1.5">
                        {issues.map((issue: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-amber-200 flex items-start gap-2"
                          >
                            <span className="text-amber-200 mt-1">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-slate-800">
                    <Button
                      onClick={() => handleApprove(contribution)}
                      disabled={processingId === contribution.id}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                    >
                      {processingId === contribution.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(contribution)}
                      disabled={processingId === contribution.id}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      {processingId === contribution.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
