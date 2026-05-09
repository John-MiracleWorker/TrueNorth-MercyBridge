import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SafeAuthProvider';
import {
  Heart,
  Search,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
  CheckCircle2,
  UserCheck,
  Users,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicNeed, NeedCategory } from '@/types/mercybridge';
import { getPublicNeeds } from '@/services/mercybridgeApi';

const CATEGORIES: { value: NeedCategory; label: string }[] = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent_housing', label: 'Rent/Housing' },
  { value: 'medical', label: 'Medical' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'food', label: 'Food' },
  { value: 'other_essentials', label: 'Other Essentials' },
];

export default function BrowseNeeds() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [needs, setNeeds] = useState<PublicNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NeedCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'urgency' | 'amount_remaining'>('newest');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    loadNeeds();
  }, [isLoggedIn, navigate]);

  const loadNeeds = async () => {
    try {
      setLoading(true);
      const data = await getPublicNeeds();
      setNeeds(data);
    } catch (error) {
      console.error('Failed to load needs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNeeds = needs
    .filter((need) => {
      if (selectedCategory !== 'all' && need.category !== selectedCategory) return false;
      if (searchTerm && !need.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      if (sortBy === 'urgency') {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
      }
      if (sortBy === 'amount_remaining') return a.amount_remaining - b.amount_remaining;
      return 0;
    });

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
              Sponsor directly
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">Browse verified needs</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Review bills that have passed MercyBridge verification, then pay the biller directly
              and upload proof for admin review.
            </p>
          </div>
          <Button
            onClick={() => navigate('/request-help')}
            className="bg-amber-200 text-slate-950 hover:bg-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
          >
            Request Help
          </Button>
        </div>

        {/* Trust Banner */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Not tax-deductible.</strong>{' '}
              You pay the biller directly. MercyBridge never holds funds. Payments are personal assistance, not charitable donations.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search needs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'urgency' | 'amount_remaining')}
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-200/40"
            >
              <option value="newest">Newest First</option>
              <option value="urgency">Most Urgent</option>
              <option value="amount_remaining">Smallest Need</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]' : 'border-white/10 text-slate-300'}
            >
              All Categories
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className={selectedCategory === cat.value ? 'bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]' : 'border-white/10 text-slate-300'}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredNeeds.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No needs found</h3>
            <p className="text-slate-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNeeds.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NeedCard({ need }: { need: PublicNeed }) {
  const navigate = useNavigate();
  const percentFunded = Math.round((need.amount_funded / need.amount_requested) * 100);

  const urgencyColors = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  const verificationIcons = {
    level_1_document: CheckCircle2,
    level_2_identity: UserCheck,
    level_3_hardship: Shield,
    level_4_community: Users,
  };

  const VerificationIcon = verificationIcons[need.verification_level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/35 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
      onClick={() => navigate(`/need/${need.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-amber-100 bg-amber-500/10 px-2 py-1 rounded">
          {need.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${urgencyColors[need.urgency_level]}`}>
          <Clock className="w-3 h-3" />
          {need.urgency_level.charAt(0).toUpperCase() + need.urgency_level.slice(1)}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-100 transition-colors">
        {need.title}
      </h3>

      {need.public_location && (
        <div className="flex items-center gap-1 text-sm text-slate-400 mb-4">
          <MapPin className="w-4 h-4" />
          {need.public_location}
        </div>
      )}

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {need.hardship_summary_public}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Raised</span>
          <span className="text-white font-medium">
            ${need.amount_funded.toLocaleString()} of ${need.amount_requested.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-white/[0.08] rounded-full h-3">
          <div
            className="bg-amber-500 h-3 rounded-full transition-all"
            style={{ width: `${percentFunded}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{percentFunded}% funded</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <VerificationIcon className="w-4 h-4 text-amber-200" />
          <span>Verified</span>
        </div>
        <Button
          size="sm"
          className="bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)]"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/need/${need.id}`);
          }}
        >
          Help
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
