import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SafeAuthProvider';
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  Eye,
  FileCheck2,
  FileText,
  Heart,
  HeartHandshake,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  SunMedium,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrueNorthLogo } from '@/components/ui/TrueNorthLogo';
import { SEO } from '@/components/seo/SEO';
import { siteUrl } from '@/lib/seoLandingPages';
import { getPublicNeeds } from '@/services/mercybridgeApi';
import type { PublicNeed } from '@/types/mercybridge';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const steps = [
  {
    icon: FileText,
    title: 'A real bill is submitted',
    body: 'Requesters share one specific essential bill and the context needed for careful review.',
  },
  {
    icon: Shield,
    title: 'MercyBridge verifies it',
    body: 'Documentation, privacy, hardship, and payment instructions are reviewed before anything goes live.',
  },
  {
    icon: CircleDollarSign,
    title: 'Sponsors pay the biller',
    body: 'Help goes directly to the provider or biller. MercyBridge does not hold or route funds.',
  },
  {
    icon: FileCheck2,
    title: 'Proof closes the loop',
    body: 'Sponsors upload confirmation so the need can be marked helped with accountability.',
  },
];

const trustModel = [
  {
    icon: Lock,
    title: 'No cash handouts',
    body: 'Direct-to-biller support protects dignity and reduces misuse without shaming the requester.',
  },
  {
    icon: Eye,
    title: 'Privacy guarded',
    body: 'Public summaries stay sanitized. Sensitive account details remain private.',
  },
  {
    icon: UserCheck,
    title: 'Human reviewed',
    body: 'MercyBridge is intentionally slower than a tip jar because real stewardship deserves care.',
  },
  {
    icon: Heart,
    title: 'Mercy, not spectacle',
    body: 'The goal is quiet burden-bearing — practical help without turning pain into content.',
  },
];

const faqs = [
  {
    question: 'Is this tax-deductible?',
    answer:
      'No. In the MVP, MercyBridge facilitates personal assistance between individuals. Contributions are not tax-deductible charitable donations.',
  },
  {
    question: 'How do I know needs are real?',
    answer:
      'Every need goes through human review. Requesters upload bill documentation, and admins verify the essential details before approval.',
  },
  {
    question: 'Does MercyBridge handle the money?',
    answer:
      'No. Sponsors pay the biller directly using the approved instructions, then upload proof for verification.',
  },
  {
    question: 'What bills qualify?',
    answer:
      'Essential needs: utilities, rent/housing, medical bills, transportation for work, childcare, food, and similar necessities.',
  },
];

export default function MercyBridgeLanding() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [needs, setNeeds] = useState<PublicNeed[]>([]);
  const [loading, setLoading] = useState(true);

  const requestRoute = isLoggedIn ? '/mercybridge/request-help' : '/register';
  const browseRoute = isLoggedIn ? '/mercybridge/browse' : '/register';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicNeeds()
      .then((data) => {
        if (!cancelled) setNeeds(data.slice(0, 3));
      })
      .catch((err) => {
        console.error('Failed to load public needs:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredNeed = needs[0];

  return (
    <div className="min-h-screen overflow-hidden bg-[#090f1d] text-white selection:bg-amber-200 selection:text-slate-950">
      <SEO
        title="MercyBridge | Verified Bill Help with Christian Stewardship"
        description="MercyBridge connects Christians with verified essential bills. Sponsors pay billers directly while MercyBridge protects dignity, privacy, and accountability."
        canonical="/mercybridge"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${siteUrl}/mercybridge/#organization`,
              name: 'MercyBridge',
              url: `${siteUrl}/mercybridge`,
            },
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/mercybridge/#website`,
              url: `${siteUrl}/mercybridge`,
              name: 'MercyBridge',
            },
          ],
        }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#090f1d_0%,#111827_48%,#090f1d_100%)]" />
        <motion.div
          className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl"
          animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0.68, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 top-72 h-[30rem] w-[30rem] rounded-full bg-emerald-300/10 blur-3xl"
          animate={{ x: [0, -35, 0], y: [0, 22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-slate-950/45 backdrop-blur-2xl safe-area-inset-top lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => navigate('/hub')}
            className="flex items-center gap-3 rounded-full text-left transition-opacity hover:opacity-85"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-200/10 shadow-[0_18px_42px_rgba(251,191,36,0.12)]">
              <HeartHandshake className="h-5 w-5 text-amber-100" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-none text-white">MercyBridge</span>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-amber-100/60 sm:block">
                TrueNorth Labs
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden rounded-full text-slate-300 hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() => navigate('/hub')}
            >
              Hub
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(isLoggedIn ? '/mercybridge/browse' : '/login')}
              className="rounded-full bg-white/10 px-4 text-white backdrop-blur-xl hover:bg-white/15"
            >
              {isLoggedIn ? 'Browse' : 'Sign in'}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-20">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-amber-100 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <SunMedium className="h-4 w-4 text-amber-200" />
              Verified bill help with dignity and accountability
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
            >
              When a bill becomes a burden,
              <span className="block bg-gradient-to-r from-amber-100 via-white to-emerald-100 bg-clip-text text-transparent">
                mercy can cross the bridge.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              MercyBridge connects Christians with real, reviewed essential needs. Sponsors pay
              billers directly — not MercyBridge, not TrueNorth — so generosity stays practical,
              private, and accountable.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate(requestRoute)}
                className="group h-12 rounded-full bg-amber-200 px-7 font-semibold text-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.25)] hover:bg-amber-100"
              >
                Request help
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(browseRoute)}
                className="h-12 rounded-full border-white/15 bg-white/[0.04] px-7 text-white backdrop-blur-xl hover:bg-white/10"
              >
                Help a neighbor
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-200" />
              </div>
            ) : featuredNeed ? (
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(251,191,36,0.22),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(16,185,129,0.18),transparent_32%)]" />
                <div className="relative rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-amber-100/60">Live example</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{featuredNeed.title}</h2>
                    </div>
                    <span className="rounded-full border border-orange-300/25 bg-orange-300/10 px-3 py-1 text-xs font-semibold text-orange-100">
                      {featuredNeed.urgency_level.charAt(0).toUpperCase() + featuredNeed.urgency_level.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <InfoRow label="Need" value={`$${featuredNeed.amount_remaining} remaining`} />
                    <InfoRow label="Category" value={featuredNeed.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                    <InfoRow label="Payment" value="Sponsor pays provider directly" />
                  </div>

                  <div className="mt-7">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">Helped</span>
                      <span className="font-medium text-white">${featuredNeed.amount_funded} of ${featuredNeed.amount_requested}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-200 to-emerald-200"
                        initial={{ width: 0 }}
                        animate={{ width: `${featuredNeed.percent_funded}%` }}
                        transition={{ delay: 0.8, duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                    {['Reviewed', 'Private', 'Direct-pay'].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3">
                        <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-200" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <div className="relative rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-6 text-center">
                  <Heart className="mx-auto mb-3 h-8 w-8 text-amber-200/60" />
                  <p className="text-sm text-slate-300">No verified needs yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Be the first to request help or check back soon.</p>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        <SectionIntro eyebrow="How it works" title="A slower, safer way to carry burdens." body="MercyBridge is designed to feel humane: clear enough for sponsors, private enough for requesters, and accountable enough for the Church to trust." />

        <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {steps.map((step, index) => (
            <FeatureCard key={step.title} item={step} index={index} />
          ))}
        </section>

        <section className="border-y border-white/10 bg-white/[0.035] py-20 backdrop-blur-xl">
          <SectionIntro eyebrow="Trust model" title="Dignity protected. Proof required. Mercy preserved." body="The point is not to make need public. The point is to make help possible without losing wisdom." />
          <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
            {trustModel.map((item, index) => (
              <FeatureCard key={item.title} item={item} index={index} muted />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.32em] text-amber-200/80">Verified needs</p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Specific needs, not vague fundraising.
              </h2>
            </div>
            <Button
              onClick={() => navigate(browseRoute)}
              className="rounded-full bg-white px-6 text-slate-950 hover:bg-amber-100"
            >
              Browse verified needs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-200" />
            </div>
          ) : needs.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No verified needs yet</h3>
              <p className="text-slate-400">Be the first to request help or check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {needs.map((need, index) => (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-100/35 cursor-pointer"
                  onClick={() => navigate(`/mercybridge/need/${need.id}`)}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100">{need.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">{need.urgency_level.charAt(0).toUpperCase() + need.urgency_level.slice(1)}</span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{need.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{need.public_location || ''}</p>
                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">Raised</span>
                      <span className="font-medium text-white">${need.amount_funded} of ${need.amount_requested}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-200 to-emerald-200"
                        style={{ width: `${need.percent_funded}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            className="overflow-hidden rounded-[2rem] border border-amber-100/15 bg-gradient-to-br from-amber-200/12 via-white/[0.05] to-emerald-200/10 p-8 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100/20 bg-amber-100/10">
                <HeartHandshake className="h-6 w-6 text-amber-100" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-amber-100/60">Stewardship coach</p>
                <h2 className="text-2xl font-semibold text-white">Wisdom for the next step</h2>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Requesters can receive Scripture-grounded financial stewardship guidance: organizing bills,
              prioritizing next actions, creating hardship budgets, and preparing creditor conversations
              with dignity instead of panic.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {['Budget prioritization', 'Creditor scripts', '7-day action plan', 'Hardship budgeting', 'Emergency planning', 'Scripture-based encouragement'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs italic text-slate-500">
              Educational stewardship guidance only — not legal, tax, investment, or professional financial advice.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 lg:px-10">
          <SectionIntro eyebrow="FAQ" title="Simple answers before someone has to ask." body="MercyBridge should feel safe before the first click." />
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-24 text-center sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-12"
          >
            <Sparkles className="mx-auto mb-5 h-8 w-8 text-amber-100" />
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Carry what you can. Ask when you must.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              MercyBridge exists for both sides of Galatians 6:2 — the one bearing a burden,
              and the one called to help carry it.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate(requestRoute)}
                className="h-12 rounded-full bg-amber-200 px-7 font-semibold text-slate-950 hover:bg-amber-100"
              >
                Request help
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(browseRoute)}
                className="h-12 rounded-full border-white/15 bg-white/[0.04] px-7 text-white hover:bg-white/10"
              >
                Help a neighbor
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/45 pb-24 backdrop-blur-xl md:pb-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <div className="flex items-center gap-3">
            <TrueNorthLogo className="h-6 w-6" />
            <span className="font-semibold text-white">MercyBridge</span>
            <span className="hidden text-slate-600 sm:inline">|</span>
            <span className="hidden text-sm text-slate-400 sm:inline">Verified bill help with Christian stewardship</span>
          </div>
          <p className="text-sm text-slate-500">Bear one another's burdens, and so fulfill the law of Christ. — Galatians 6:2</p>
        </div>
      </footer>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      className="mx-auto max-w-3xl px-5 pb-10 text-center sm:px-8 lg:px-10"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.32em] text-amber-200/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-300">{body}</p>
    </motion.div>
  );
}

function FeatureCard({
  item,
  index,
  muted = false,
}: {
  item: { icon: typeof Heart; title: string; body: string };
  index: number;
  muted?: boolean;
}) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ delay: index * 0.08 }}
      className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/15 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-100/30"
    >
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${
          muted
            ? 'border-emerald-200/15 bg-emerald-200/10 text-emerald-100'
            : 'border-amber-200/15 bg-amber-200/10 text-amber-100'
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
    </motion.div>
  );
}
