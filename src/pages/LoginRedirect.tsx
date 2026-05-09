import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/lib/logger';

const HUB_LOGIN_URL = 'https://www.find-true-north.net/login';

export default function LoginRedirect() {
  const location = useLocation();

  useEffect(() => {
    // Store current MercyBridge path so we can return after hub login
    try {
      sessionStorage.setItem('mb_return_path', location.pathname + location.search);
    } catch {
      // ignore
    }
    
    logger.info('[LoginRedirect] Redirecting to hub login');
    window.location.href = HUB_LOGIN_URL;
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
