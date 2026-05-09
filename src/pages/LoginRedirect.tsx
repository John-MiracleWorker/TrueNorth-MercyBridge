import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/lib/logger';

const HUB_LOGIN_URL = 'https://www.find-true-north.net/login';

export default function LoginRedirect() {
  const location = useLocation();

  useEffect(() => {
    // Build the return URL - current path on MercyBridge
    const returnTo = `${window.location.origin}${location.pathname}${location.search}`;
    const loginUrl = `${HUB_LOGIN_URL}?return_to=${encodeURIComponent(returnTo)}`;
    
    logger.info('[LoginRedirect] Redirecting to hub login:', loginUrl);
    window.location.href = loginUrl;
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
