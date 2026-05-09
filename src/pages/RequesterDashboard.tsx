import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Inbox, Loader2, TrendingUp, AlertCircle, FileText, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRequesterDashboard } from '@/services/mercybridgeApi';
import type { Need, RequesterDashboard as RequesterDashboardData } from '@/types/mercybridge';

function money(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function statusBadge(status: Need['status']) {
  const base = 'rounded-full border px-2 py-0.5 text-xs font-medium';
  if (status === 'submitted') {
    return `${base} border-amber-500/30 bg-amber-500/10 text-amber-300`;
  }
  if (status === 'more_info_needed') {
    return `${base} border-orange-500/30 bg-orange-500/10 text-orange-300`;
  }
  if (status === 'approved') {
    return `${base} border-emerald-500/30 bg-emerald-500/10 text-emerald-300`;
  }
  if (status === 'rejected') {
    return `${base} border-red-500/30 bg-red-500/10 text-red-300`;
  }
  if (['partially_funded', 'funded'].includes(status)) {
    return `${base} border-blue-500/30 bg-blue-500/10 text-blue-300`;
  }
  if (status === 'paid') {
    return `${base} border-emerald-500/30 bg-emerald-500/10 text-emerald-300`;
  }
  if (status === 'archived') {
    return `${base} border-slate-600 bg-white/[0.08] text-slate-400`;
  }
  return `${base} border-slate-600 bg-white/[0.08] text-slate-400`;
}

function statusLabel(status: Need['status']) {
  if (status === 'submitted') return 'Submitted';
  if (status === 'more_info_needed') return 'More info needed';
  if (status === 'approved') return 'Approved - Awaiting sponsor';
  if (status === 'partially_funded') return 'Partially funded';
  if (status === 'funded') return 'Fully funded';
  if (status === 'paid') return 'Paid to biller';
  if (status === 'rejected') return 'Not approved';
  if (status === 'archived') return 'Archived';
  return status.replace('_', ' ');
}

function statusIcon(status: Need['status']) {
  if (status === 'submitted') return <Clock className="w-4 h-4 text-amber-100" />;
  if (status === 'more_info_needed') return <AlertCircle className="w-4 h-4 text-orange-400" />;
  if (['approved', 'paid'].includes(status)) return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === 'rejected') return <AlertCircle className="w-4 h-4 text-red-400" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
}

function NeedList({ title, needs }: { title: string; needs: Need[] }) {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="border-b border-white/10 p-4">
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      {needs.length === 0 ? (
        <p className="p-4 text-sm text-slate-400">Nothing here yet.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {needs.map((need) => (
            <button
              key={need.id}
              onClick={() => navigate(`/need/${need.id}`)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-white/[0.055]"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{need.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={statusBadge(need.status)}>
                    {statusIcon(need.status)}
                    <span className="ml-1">{statusLabel(need.status)}</span>
                  </span>
                  <span className="text-sm text-slate-400">
                    {money(need.amount_funded)} of {money(need.amount_requested)}
                  </span>
                </div>
                {need.status === 'more_info_needed' && need.review_notes && (
                  <p className="mt-1 text-xs text-amber-100">
                    {need.review_notes}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default function RequesterDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<RequesterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRequesterDashboard()
      .then(setDashboard)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading MercyBridge dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return <div className="p-8 text-center text-red-300">{error || 'Dashboard unavailable'}</div>;
  }

  const stats = [
    { label: 'Active Needs', value: dashboard.active_needs.length, icon: Inbox, color: 'text-amber-100' },
    { label: 'Funded', value: dashboard.funded_needs.length, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Paid', value: dashboard.paid_needs.length, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Total Raised', value: money(dashboard.total_raised), icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">My MercyBridge Dashboard</h1>
          <p className="text-slate-400">Track submitted needs, funding progress, and stewardship tasks.</p>
        </motion.div>

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

        {/* Privacy & Data Retention Note */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <EyeOff className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              Your raw hardship documents are purged after AI review. Only bill summaries and audit metadata remain.
              Account numbers and addresses are never shown publicly.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">Stewardship</h2>
              <p className="text-sm text-slate-400">
                {dashboard.stewardship_plan_count} plans • {dashboard.pending_tasks.length} pending tasks
              </p>
            </div>
            <Button
              onClick={() => navigate('/stewardship')}
              className="bg-amber-200 font-semibold text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
            >
              Open Coach
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {dashboard.pending_tasks.length > 0 ? (
            <div className="mt-4 space-y-2">
              {dashboard.pending_tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="rounded-lg bg-slate-950/35 p-3 text-sm text-slate-300">
                  <Clock className="mr-2 inline h-4 w-4 text-amber-100" />
                  {task.title}: {task.description}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <NeedList title="Active" needs={dashboard.active_needs} />
          <NeedList title="Funded" needs={dashboard.funded_needs} />
          <NeedList title="Paid" needs={dashboard.paid_needs} />
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/request-help')}
            className="bg-amber-200 font-semibold text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
          >
            Submit a Need
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
