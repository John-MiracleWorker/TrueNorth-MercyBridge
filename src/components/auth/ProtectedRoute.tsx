import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SafeAuthProvider';
import { buildServiceHubUrl, buildTrueNorthLoginUrl } from '@/lib/serviceHub';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isBanned, isPermanentlyBanned } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const returnTo = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
        window.location.replace(buildTrueNorthLoginUrl(returnTo));
        return;
      }

      if (isPermanentlyBanned) {
        if (location.pathname !== '/banned') {
          window.location.replace(buildServiceHubUrl('/login?error=banned'));
        }
        return;
      }

      if (isBanned && !isPermanentlyBanned) {
        if (!location.pathname.startsWith('/appeal')) {
          window.location.replace(buildServiceHubUrl('/login?error=appeal_required'));
        }
        return;
      }
    }
  }, [
    user,
    loading,
    isBanned,
    isPermanentlyBanned,
    location.pathname,
    location.search,
    location.hash,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isPermanentlyBanned && location.pathname !== '/banned') {
    return null;
  }

  if (isBanned && !isPermanentlyBanned && !location.pathname.startsWith('/appeal')) {
    return null;
  }

  return <>{children}</>;
};
