import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { buildTrueNorthLoginUrl } from '@/lib/serviceHub';

export default function LoginRedirect() {
  const location = useLocation();

  useEffect(() => {
    const returnTo = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    const loginUrl = buildTrueNorthLoginUrl(returnTo);

    logger.info('[LoginRedirect] Redirecting to hub login with a validated return destination');
    window.location.replace(loginUrl);
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
