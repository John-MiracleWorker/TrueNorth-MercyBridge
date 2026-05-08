import { logger } from '@/lib/logger';
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SafeAuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const isChecking = useMemo(() => loading || (user && isAdmin === null), [loading, user, isAdmin]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) {
        setIsAdmin(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (cancelled) return;
        if (error) throw error;

        setIsAdmin(Boolean(data?.is_admin));
      } catch (err) {
        if (cancelled) return;
        logger.error("[AdminRoute] Failed to check admin status:", err);
        setIsAdmin(false);
      }
    }

    if (!loading) {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (isAdmin === null) return;

    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, loading, navigate, user]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
