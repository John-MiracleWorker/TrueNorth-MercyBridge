import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Heart, Loader2, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMyContributions, getSponsorDashboard } from '@/services/mercybridgeApi';
import type { Contribution, SponsorDashboard as SponsorDashboardData } from '@/types/mercybridge';

function money(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function badge(status: string) {
  if (status === 'completed') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (status === 'failed') return 'border-red-500/30 bg-red-500/10 text-red-300';
  return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
}

export default function SponsorDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<SponsorDashboardData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSponsorDashboard(), getMyContributions()])
      .then(([nextDashboard, nextContributions]) => {
        setDashboard(nextDashboard);
        setContributions(nextContributions);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load giving dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading sponsorship dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return <div className="p-8 text-center text-red-300">{error || 'Dashboard unavailable'}</div>;
  }

  const stats = [
    { label: 'Total Given', value: money(dashboard.total_contributed), icon: TrendingUp, color: 'text-amber-100' },
    { label: 'Needs Helped', value: dashboard.needs_helped, icon: Heart, color: 'text-red-400' },
    { label: 'Pending Proofs', value: dashboard.active_contributions, icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Sponsorships</h1>
          <p className="text-slate-400">{dashboard.impact_summary}</p>
        </motion.div>

        {/* Trust Banner */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Not tax-deductible.</strong>{' '}
              You paid billers directly. MercyBridge never held or processed these funds.
              Payments are personal assistance, not charitable donations.
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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

        <section className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h2 className="font-semibold text-white">Payment Proofs</h2>
            <Button
              size="sm"
              onClick={() => navigate('/browse')}
              className="bg-amber-200 text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
            >
              Browse Needs
            </Button>
          </div>
          {contributions.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="mx-auto mb-3 h-10 w-10 text-slate-500" />
              <h3 className="font-semibold text-white">No payment proofs yet</h3>
              <p className="mt-1 text-sm text-slate-400">Pay a biller directly and upload proof to see it here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {contributions.map((contribution) => (
                <button
                  key={contribution.id}
                  onClick={() => navigate(`/need/${contribution.need_id}`)}
                  className="flex w-full flex-col gap-3 p-4 text-left hover:bg-white/[0.055] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white">{contribution.need?.title || 'MercyBridge need'}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-400">
                        {money(contribution.amount)} • {contribution.payment_method.replace('_', ' ')}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-xs ${badge(contribution.status)}`}>
                        {contribution.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
