import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SafeAuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isBanned, isPermanentlyBanned } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (isPermanentlyBanned) {
        if (location.pathname !== '/banned') {
          navigate('/banned', { replace: true });
        }
        return;
      }

      if (isBanned && !isPermanentlyBanned) {
        if (!location.pathname.startsWith('/appeal')) {
          navigate('/appeal', { replace: true });
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
    navigate,
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
