import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  Shield,
  Sparkles,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ContributionVerifyModal } from "@/components/ContributionVerifyModal";
import { PayeeDirectoryAdmin } from "@/components/PayeeDirectoryAdmin";
import {
  getAdminDashboard,
  getNeedAIScreeningsForNeeds,
  getPendingContributions,
  getPendingNeeds,
  markNeedPaid,
  reviewNeed,
} from "@/services/mercybridgeApi";
import type {
  AdminDashboard,
  Contribution,
  Need,
  NeedAIScreening,
  ReviewerChecklist,
} from "@/types/mercybridge";

function money(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getUrgencyColor(level: string) {
  switch (level) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
}

function getAiStatusClasses(status?: Contribution["ai_verification_status"]) {
  switch (status) {
    case "verified":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "flagged":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "failed":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-slate-600/40 bg-white/[0.08]/60 text-slate-300";
  }
}

function getAiStatusLabel(contribution: Contribution) {
  const status = contribution.ai_verification_status || "pending";
  const confidence = contribution.ai_confidence_score;
  const suffix =
    typeof confidence === "number" && confidence > 0 ? ` - ${confidence}%` : "";
  return `AI ${status}${suffix}`;
}

function getNeedStatusClasses(status: Need["status"]) {
  switch (status) {
    case "approved":
    case "funded":
    case "paid":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "rejected":
    case "archived":
    case "cancelled":
      return "border-slate-600/40 bg-white/[0.08]/60 text-slate-300";
    case "more_info_needed":
    case "submitted":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }
}

function getNeedAiStatusLabel(need: Need, screening?: NeedAIScreening | null) {
  const status = need.ai_screening_status || "pending";
  const score = screening?.score;
  const suffix = typeof score === "number" && score > 0 ? ` - ${score}%` : "";
  return `AI screening ${status}${suffix}`;
}

export default function MercyBridgeAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedNeedId, setExpandedNeedId] = useState<string | null>(null);
  const [reviewChecklists, setReviewChecklists] = useState<
    Record<string, ReviewerChecklist>
  >({});
  const [reviewDecisionReasons, setReviewDecisionReasons] = useState<
    Record<string, string>
  >({});
  const [aiScreeningsMap, setAiScreeningsMap] = useState<
    Record<string, NeedAIScreening>
  >({});
  const notice =
    typeof location.state === "object" &&
    location.state &&
    "message" in location.state
      ? String(location.state.message)
      : null;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [adminData, pendingNeeds, pendingContributions] = await Promise.all(
        [getAdminDashboard(), getPendingNeeds(), getPendingContributions()],
      );
      setDashboard(adminData);
      setNeeds(pendingNeeds);
      setContributions(pendingContributions);

      // Fetch AI screenings for pending needs + recent screenings
      const needIds = [
        ...pendingNeeds.map((n) => n.id),
        ...adminData.recent_ai_screenings.map((s) => s.need_id),
      ].filter((v, i, a) => a.indexOf(v) === i);

      if (needIds.length > 0) {
        const screenings = await getNeedAIScreeningsForNeeds(needIds);
        const map: Record<string, NeedAIScreening> = {};
        screenings.forEach((s) => {
          map[s.need_id] = s;
        });
        setAiScreeningsMap(map);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const review = async (need: Need, action: "approved" | "rejected") => {
    setProcessingId(need.id);
    try {
      const checklist = reviewChecklists[need.id] || {};
      const decisionReason = reviewDecisionReasons[need.id];

      await reviewNeed(need.id, {
        action,
        notes:
          action === "approved"
            ? "Approved from MercyBridge admin queue."
            : "Rejected from MercyBridge admin queue.",
        rejection_reason:
          action === "rejected"
            ? "Need did not meet MercyBridge verification criteria."
            : undefined,
        verification_level:
          action === "approved" ? need.verification_level : undefined,
        checklist,
        decision_reason:
          decisionReason ||
          (action === "approved"
            ? "Approved after objective review."
            : "Rejected after objective review."),
        public_summary_approved: need.hardship_summary_public || undefined,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setProcessingId(null);
    }
  };

  const markPaid = async (need: Need) => {
    setProcessingId(need.id);
    try {
      await markNeedPaid(need.id, {
        payment_confirmation_note:
          "Requester/biller payment marked paid after verified direct-pay funding.",
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark paid");
    } finally {
      setProcessingId(null);
    }
  };

  const updateChecklist = (
    needId: string,
    key: keyof ReviewerChecklist,
    value: boolean,
  ) => {
    setReviewChecklists((prev) => ({
      ...prev,
      [needId]: { ...prev[needId], [key]: value },
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading MercyBridge admin...
      </div>
    );
  }

  const stats = [
    {
      label: "Pending Review",
      value: dashboard?.pending_review_count || 0,
      icon: Clock,
      color: "text-amber-100",
    },
    {
      label: "Pending Proofs",
      value: contributions.length,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      label: "AI Flagged",
      value:
        (dashboard?.stats.ai_flagged_needs || 0) +
        contributions.filter((c) =>
          ["flagged", "failed"].includes(c.ai_verification_status || ""),
        ).length,
      icon: AlertTriangle,
      color: "text-amber-100",
    },
    {
      label: "Funded Needs",
      value: dashboard?.stats.total_funded || 0,
      icon: TrendingUp,
      color: "text-blue-400",
    },
  ];
  const recentNeedScreenings = dashboard?.recent_ai_screenings || [];
  const recentScreenedNeeds = dashboard?.recent_screened_needs || [];
  const recentNeeds = dashboard?.recent_needs || [];

  // Build a map of need_id -> Need for lookups
  const needMap = new Map<string, Need>();
  recentScreenedNeeds.forEach((n) => needMap.set(n.id, n));
  recentNeeds.forEach((n) => needMap.set(n.id, n));
  needs.forEach((n) => needMap.set(n.id, n));

  const recentAiResults = (dashboard?.recent_contributions || []).filter(
    (contribution) =>
      contribution.ai_verification_status &&
      contribution.ai_verification_status !== "pending" &&
      contribution.ai_verified_at,
  );

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">MercyBridge Admin</h1>
          <p className="text-slate-400">
            Review needs and verify direct-payment proofs.
          </p>
        </motion.div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 backdrop-blur-xl p-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 backdrop-blur-xl p-3 text-sm text-emerald-300">
            {notice}
          </div>
        ) : null}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4"
            >
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <PayeeDirectoryAdmin />

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <Inbox className="h-5 w-5 text-slate-300" />
            <div>
              <h2 className="font-semibold text-white">Recent Requests</h2>
              <p className="text-xs text-slate-500">
                Open a request to archive it or permanently delete test/spam
                records.
              </p>
            </div>
          </div>
          {recentNeeds.length > 0 ? (
            <div className="divide-y divide-white/10">
              {recentNeeds.map((need) => (
                <button
                  key={need.id}
                  className="block w-full p-4 text-left transition hover:bg-slate-950/35"
                  onClick={() => navigate(`/need/${need.id}`)}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{need.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                        <span>{money(need.amount_requested)} requested</span>
                        <span>{need.biller_name}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs ${getNeedStatusClasses(need.status)}`}
                        >
                          {need.status.split("_").join(" ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">
                      {new Date(
                        need.submitted_at || need.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="p-6 text-sm text-slate-400">No requests found.</p>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <Sparkles className="h-5 w-5 text-amber-100" />
            <div>
              <h2 className="font-semibold text-white">
                AI Verification Activity
              </h2>
              <p className="text-xs text-slate-500">
                Kimi AI screens requests and checks direct-payment proof
                uploads.
              </p>
            </div>
          </div>
          {recentAiResults.length > 0 ? (
            <div className="divide-y divide-white/10">
              {recentAiResults.slice(0, 5).map((contribution) => (
                <div
                  key={contribution.id}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getAiStatusClasses(contribution.ai_verification_status)}`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {getAiStatusLabel(contribution)}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {money(contribution.amount)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {contribution.ai_verified_at
                          ? new Date(
                              contribution.ai_verified_at,
                            ).toLocaleString()
                          : "Not run yet"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {contribution.need?.title ||
                        contribution.need?.biller_name ||
                        `Need ${contribution.need_id.slice(0, 8)}`}
                    </p>
                    {contribution.ai_verification_result?.notes ? (
                      <p className="mt-1 text-xs text-slate-500">
                        {contribution.ai_verification_result.notes}
                      </p>
                    ) : null}
                    {contribution.ai_review_queue_reason && (
                      <p className="mt-1 text-xs text-amber-200">
                        Queue reason: {contribution.ai_review_queue_reason}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                    onClick={() => setSelectedContribution(contribution)}
                  >
                    View AI Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 p-5 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
                <p className="text-2xl font-bold text-white">
                  {dashboard?.stats.ai_screened_needs || 0}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  AI request screenings completed
                </p>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-amber-200">
                  Waiting for proof upload
                </p>
                <p className="mt-1 text-sm text-amber-100/70">
                  A submitted bill creates a need review item. AI verification
                  starts when a sponsor uploads a payment receipt or
                  confirmation screenshot.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm font-semibold text-slate-200">
                  Bill review is manual
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Need documents appear below for admin review; they are not
                  counted as AI payment-proof verifications.
                </p>
              </div>
            </div>
          )}
        </section>

        {recentNeedScreenings.length > 0 ? (
          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div>
                <h2 className="font-semibold text-white">
                  Recent Request Screening
                </h2>
                <p className="text-xs text-slate-500">
                  AI intake review of uploaded bills and requester signals.
                </p>
              </div>
            </div>
            <div className="divide-y divide-white/10">
              {recentNeedScreenings.slice(0, 5).map((screening) => {
                const need = needMap.get(screening.need_id);
                return (
                  <button
                    key={screening.id}
                    className="block w-full p-4 text-left transition hover:bg-slate-950/35"
                    onClick={() => navigate(`/need/${screening.need_id}`)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getAiStatusClasses(screening.screening_status as Contribution["ai_verification_status"])}`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {getNeedAiStatusLabel(
                          need ||
                            ({
                              ai_screening_status: screening.screening_status,
                            } as Need),
                          screening,
                        )}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {need?.biller_name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {money(need?.amount_requested || 0)} requested
                      </span>
                    </div>
                    {screening.result?.reasons?.length ? (
                      <p className="mt-2 text-sm text-slate-400">
                        {screening.result.reasons[0]}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <Inbox className="h-5 w-5 text-amber-100" />
              <h2 className="font-semibold text-white">
                Need Review Queue ({needs.length})
              </h2>
            </div>
            {needs.length === 0 ? (
              <p className="p-6 text-sm text-slate-400">
                No needs waiting for review.
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {needs.map((need) => {
                  const isExpanded = expandedNeedId === need.id;
                  const checklist = reviewChecklists[need.id] || {};
                  const decisionReason = reviewDecisionReasons[need.id] || "";
                  const aiScreening = aiScreeningsMap[need.id];
                  const aiResult = aiScreening?.result;

                  return (
                    <div key={need.id} className="p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                          className="flex-1 text-left"
                          onClick={() =>
                            setExpandedNeedId(isExpanded ? null : need.id)
                          }
                          aria-expanded={isExpanded}
                          aria-controls={`need-details-${need.id}`}
                        >
                          <h3 className="font-semibold text-white">
                            {need.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                            <span>{money(need.bill_amount)}</span>
                            <span className="capitalize">
                              {need.category.replace("_", " ")}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs ${getAiStatusClasses(need.ai_screening_status as Contribution["ai_verification_status"])}`}
                            >
                              {getNeedAiStatusLabel(need, aiScreening)}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs ${getUrgencyColor(need.urgency_level)}`}
                            >
                              {need.urgency_level}
                            </span>
                          </div>
                        </button>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === need.id}
                            className="border-green-600 text-green-400 hover:bg-green-600/20"
                            onClick={() => review(need, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === need.id}
                            className="border-red-600 text-red-400 hover:bg-red-600/20"
                            onClick={() => review(need, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          id={`need-details-${need.id}`}
                          className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              Reviewer Checklist
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(checklist.bill_legitimacy)}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "bill_legitimacy",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                Bill looks legitimate
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(checklist.bill_form_match)}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "bill_form_match",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                Bill matches form data
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(checklist.hardship_signal)}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "hardship_signal",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                Hardship signal present
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(
                                    checklist.requester_duplicate_risk,
                                  )}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "requester_duplicate_risk",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                No duplicate risk
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(
                                    checklist.public_summary_safe,
                                  )}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "public_summary_safe",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                Public summary is safe
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300">
                                <Checkbox
                                  checked={Boolean(
                                    checklist.payment_instructions_safe,
                                  )}
                                  onCheckedChange={(checked) =>
                                    updateChecklist(
                                      need.id,
                                      "payment_instructions_safe",
                                      Boolean(checked),
                                    )
                                  }
                                  className="border-slate-600"
                                />
                                Payment instructions safe
                              </label>
                            </div>
                          </div>

                          {aiResult && (
                            <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                              <h4 className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-100" />
                                AI Extracted Data
                              </h4>
                              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                                <div className="text-slate-400">
                                  Biller:{" "}
                                  <span className="text-white">
                                    {aiResult.extracted_biller || "N/A"}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  Amount:{" "}
                                  <span className="text-white">
                                    {typeof aiResult.extracted_amount ===
                                    "number"
                                      ? `$${aiResult.extracted_amount.toFixed(2)}`
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  Due:{" "}
                                  <span className="text-white">
                                    {aiResult.extracted_due_date || "N/A"}
                                  </span>
                                </div>
                              </div>
                              {aiResult.hardship_evidence_strength && (
                                <div className="mt-2 text-xs text-slate-400">
                                  Evidence:{" "}
                                  <span
                                    className={`font-medium ${aiResult.hardship_evidence_strength === "strong" ? "text-emerald-400" : "text-amber-100"}`}
                                  >
                                    {aiResult.hardship_evidence_strength}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-medium text-slate-300">
                              Decision Reason
                            </label>
                            <Textarea
                              value={decisionReason}
                              onChange={(e) =>
                                setReviewDecisionReasons((prev) => ({
                                  ...prev,
                                  [need.id]: e.target.value,
                                }))
                              }
                              placeholder="Why are you approving or rejecting this request?"
                              className="mt-1 border-white/10 bg-slate-950/45 text-slate-100 text-xs"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h2 className="font-semibold text-white">
                Payment Proof Queue ({contributions.length})
              </h2>
            </div>
            {contributions.length === 0 ? (
              <p className="p-6 text-sm text-slate-400">
                No direct-payment proofs waiting for verification.
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {contributions.map((contribution) => (
                  <div key={contribution.id} className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {contribution.need?.title || "MercyBridge need"}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm text-slate-400">
                            {money(contribution.amount)} -{" "}
                            {contribution.confirmation_number ||
                              "proof document"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getAiStatusClasses(contribution.ai_verification_status)}`}
                          >
                            <Sparkles className="h-3 w-3" />
                            {getAiStatusLabel(contribution)}
                          </span>
                          {contribution.sponsor_ack_direct_pay && (
                            <span className="rounded-full border border-slate-600 px-2 py-0.5 text-xs text-slate-400">
                              Disclosure OK
                            </span>
                          )}
                        </div>
                        {contribution.ai_verification_result?.notes ? (
                          <p className="mt-2 text-xs text-slate-500">
                            {contribution.ai_verification_result.notes}
                          </p>
                        ) : null}
                        {contribution.ai_review_queue_reason && (
                          <p className="mt-1 text-xs text-amber-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {contribution.ai_review_queue_reason}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-200 font-semibold text-slate-950 hover:bg-emerald-100 shadow-[0_0_32px_rgba(16,185,129,0.12)]"
                        onClick={() => setSelectedContribution(contribution)}
                      >
                        View Proof
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {(dashboard?.needs_today || []).filter(
          (need) => need.status === "funded",
        ).length > 0 ? (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="border-b border-white/10 p-4">
              <h2 className="font-semibold text-white">
                Funded Needs Ready to Mark Paid
              </h2>
            </div>
            {(dashboard?.needs_today || [])
              .filter((need) => need.status === "funded")
              .map((need) => (
                <div
                  key={need.id}
                  className="flex items-center justify-between border-b border-white/10 p-4 last:border-0"
                >
                  <div>
                    <h3 className="font-medium text-white">{need.title}</h3>
                    <p className="text-sm text-slate-400">
                      {money(need.amount_funded)} verified
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={processingId === need.id}
                    onClick={() => markPaid(need)}
                  >
                    Mark paid
                  </Button>
                </div>
              ))}
          </section>
        ) : null}
      </div>

      <ContributionVerifyModal
        contribution={selectedContribution}
        onClose={() => setSelectedContribution(null)}
        onVerified={load}
      />
    </div>
  );
}
