import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardCheck,
  Compass,
  HelpingHand,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SafeAuthProvider';
import { getMercyBridgeRole } from '@/services/mercybridgeApi';
import { prefetchRoute } from '@/hooks/useRoutePrefetch';
import { buildServiceHubUrl } from '@/lib/serviceHub';

interface MercyBridgeLayoutProps {
  children: ReactNode;
}

interface MercyBridgeNavItem {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  adminOnly?: boolean;
}

const navItems: MercyBridgeNavItem[] = [
  {
    to: '/',
    label: 'Overview',
    description: 'How direct-pay help works',
    icon: Home,
  },
  {
    to: '/browse',
    label: 'Browse Needs',
    description: 'Sponsor verified bills',
    icon: Search,
  },
  {
    to: '/request-help',
    label: 'Request Help',
    description: 'Submit a bill for review',
    icon: HelpingHand,
  },
  {
    to: '/dashboard',
    label: 'My Requests',
    description: 'Track submitted needs',
    icon: LayoutDashboard,
  },
  {
    to: '/sponsor-dashboard',
    label: 'My Sponsorships',
    description: 'Proofs and impact',
    icon: ClipboardCheck,
  },
  {
    to: '/stewardship',
    label: 'Stewardship Coach',
    description: 'Plan the next step',
    icon: Sparkles,
  },
  {
    to: '/admin',
    label: 'Verification',
    description: 'Review needs and proofs',
    icon: ShieldCheck,
    adminOnly: true,
  },
];

function isRouteActive(pathname: string, target: string) {
  if (target === '/') {
    return pathname === '/';
  }

  if (target === '/browse') {
    return pathname === '/browse' || pathname.startsWith('/need/');
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}

function MercyBridgeMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-200/15 to-emerald-200/10 text-amber-100 shadow-[0_18px_42px_rgba(251,191,36,0.14)]',
          compact ? 'h-10 w-10' : 'h-12 w-12'
        )}
      >
        <HeartHandshake className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
      </span>
      <div className="min-w-0">
        <p className={cn('truncate font-semibold text-white', compact ? 'text-base' : 'text-lg')}>
          MercyBridge
        </p>
        <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-amber-100/55">
          Direct-pay mercy
        </p>
      </div>
    </div>
  );
}

export function MercyBridgeLayout({ children }: MercyBridgeLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMercyBridgeRole().then((nextRole) => {
      if (!cancelled) setRole(nextRole);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const visibleNavItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (!item.adminOnly) return true;
        return role === 'admin' || role === 'reviewer';
      }),
    [role]
  );

  const renderNavLink = (item: MercyBridgeNavItem) => {
    const Icon = item.icon;
    const active = isRouteActive(location.pathname, item.to);

    return (
      <NavLink
        key={item.to}
        to={item.to}
        onMouseEnter={() => prefetchRoute(item.to)}
        onFocus={() => prefetchRoute(item.to)}
        onTouchStart={() => prefetchRoute(item.to)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
          active
            ? 'border-amber-200/25 bg-gradient-to-r from-amber-200/12 to-emerald-200/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
            : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon
          className={cn(
            'h-5 w-5 shrink-0',
            active ? 'text-amber-100' : 'text-slate-500 group-hover:text-amber-100'
          )}
        />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{item.label}</span>
          <span className="block truncate text-xs text-slate-500 group-hover:text-slate-400">
            {item.description}
          </span>
        </span>
      </NavLink>
    );
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.10),transparent_34%),linear-gradient(180deg,#090f1d,#0b1220)] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <MercyBridgeMark />
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5" aria-label="MercyBridge">
        {visibleNavItems.map(renderNavLink)}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl border border-amber-200/20 bg-gradient-to-r from-amber-200/12 to-emerald-200/8 px-3 py-3 text-amber-100 hover:border-amber-100/35 hover:bg-amber-200/15 hover:text-white"
          onClick={() => window.location.assign(buildServiceHubUrl('/hub'))}
        >
          <ArrowLeft className="h-4 w-4" />
          Service Hub
        </Button>
        <a
          href={buildServiceHubUrl('/')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-start gap-3 rounded-xl border border-sky-200/20 bg-gradient-to-r from-sky-200/12 to-cyan-200/8 px-3 py-3 text-sm font-medium text-sky-100 transition-colors hover:border-sky-100/35 hover:bg-sky-200/15 hover:text-white"
        >
          <Compass className="h-4 w-4" />
          TrueNorth
        </a>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-start gap-2.5">
            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-amber-100" />
            <p className="text-xs leading-5 text-slate-400">
              Sponsors pay billers directly. MercyBridge verifies proof and keeps the LLC out of
              the money flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090f1d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(16,185,129,0.10),transparent_28%),linear-gradient(180deg,#090f1d_0%,#111827_48%,#090f1d_100%)]" />
        <motion.div
          aria-hidden
          className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.38, 0.62, 0.38] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-32 top-72 h-[30rem] w-[30rem] rounded-full bg-emerald-300/10 blur-3xl"
          animate={{ x: [0, -34, 0], y: [0, 24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.024)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/10 lg:block">
        {sidebar}
      </aside>

      <header className="sticky top-0 z-[70] border-b border-white/10 bg-slate-950/75 px-4 py-3 shadow-lg shadow-slate-950/30 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] text-slate-100 hover:bg-white/[0.08]"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open MercyBridge navigation"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <MercyBridgeMark compact />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300/15 hover:text-white"
            onClick={() => window.location.assign(buildServiceHubUrl('/hub'))}
            aria-label="Open TrueNorth"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/75"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close MercyBridge navigation"
          />
          <div className="relative h-full w-[21rem] max-w-[86vw] border-r border-white/10 shadow-2xl">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 h-10 w-10 rounded-xl border border-white/10 bg-white/[0.05] text-slate-100 hover:bg-white/[0.1]"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close MercyBridge navigation"
            >
              <X className="h-5 w-5" />
            </Button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="relative z-10 lg:pl-80">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
