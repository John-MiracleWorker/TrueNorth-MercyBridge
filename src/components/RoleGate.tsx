import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { getMercyBridgeRole } from '@/services/mercybridgeApi';

interface RoleGateProps {
  children: ReactNode;
  allowed?: string[];
}

export function RoleGate({ children, allowed = ['admin', 'reviewer'] }: RoleGateProps) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getMercyBridgeRole()
      .then((nextRole) => {
        if (!cancelled) setRole(nextRole);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[hsl(var(--celestial-text-muted))]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Checking MercyBridge access...
      </div>
    );
  }

  if (!role || !allowed.includes(role)) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="font-serif text-3xl text-white">Admin access needed</h1>
        <p className="mt-3 text-slate-400">
          The MercyBridge admin portal is available to TrueNorth admins and MercyBridge reviewers.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/mercybridge"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            MercyBridge overview
          </Link>
          <Link
            to="/hub"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Service Hub
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
