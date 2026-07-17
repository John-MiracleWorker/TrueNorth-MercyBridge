import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPendingNeeds, reviewNeed } from '@/services/mercybridgeApi';
import type { Need, NeedStatus } from '@/types/mercybridge';

const filters: Array<NeedStatus | 'all'> = ['all', 'submitted', 'more_info_needed'];

export default function AdminReviewQueue() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filter, setFilter] = useState<NeedStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadNeeds = async () => {
    setLoading(true);
    try {
      setNeeds(await getPendingNeeds());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNeeds();
  }, []);

  const visibleNeeds = useMemo(
    () => needs.filter((need) => filter === 'all' || need.status === filter),
    [filter, needs],
  );

  const handleReview = async (need: Need, action: 'approved' | 'rejected') => {
    setProcessingId(need.id);
    try {
      await reviewNeed(need.id, {
        action,
        notes: action === 'approved' ? 'Approved from review queue.' : 'Rejected from review queue.',
        rejection_reason: action === 'rejected' ? 'Need did not pass review.' : undefined,
      });
      await loadNeeds();
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading review queue...
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="review-queue-title" className="font-semibold text-white">Review Queue</h2>
          <p className="text-sm text-slate-400">{visibleNeeds.length} needs shown</p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="review-queue-title"
        >
          {filters.map((item) => (
            <button
              key={item}
              aria-label={`Filter by ${item.replace('_', ' ')}`}
              aria-pressed={filter === item}
              className={`rounded-full border px-3 py-1 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 hover:bg-white/5 transition-colors ${
                filter === item
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : 'border-white/10 text-slate-400'
              }`}
              onClick={() => setFilter(item)}
            >
              {item.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {visibleNeeds.length === 0 ? (
        <p className="p-6 text-sm text-slate-400">No needs match this filter.</p>
      ) : (
        <div className="divide-y divide-slate-700">
          {visibleNeeds.map((need) => (
            <div key={need.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">{need.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {need.category.replace('_', ' ')} • ${Number(need.amount_requested).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={processingId === need.id}
                  className="border-green-600 text-green-400 hover:bg-green-600/20"
                  onClick={() => handleReview(need, 'approved')}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={processingId === need.id}
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                  onClick={() => handleReview(need, 'rejected')}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
