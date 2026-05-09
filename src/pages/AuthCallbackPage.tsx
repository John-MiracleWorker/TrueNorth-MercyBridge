import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution due to React Strict Mode or re-renders
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');

    const handleAuthCallback = async () => {
      try {
        // First check if we already have a session (e.g., from localStorage)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          logger.info('[AuthCallback] Existing session found, redirecting');
          navigate('/', { replace: true });
          return;
        }

        // If no session and no code, something went wrong
        if (!code) {
          setError('No authentication code found. Please try signing in again.');
          setLoading(false);
          return;
        }

        logger.info('[AuthCallback] Exchanging code for session');
        
        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          throw exchangeError;
        }

        // Give Supabase a moment to persist to localStorage, then verify
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session: newSession } } = await supabase.auth.getSession();
        
        if (newSession) {
          logger.info('[AuthCallback] Session established, redirecting');
          navigate('/', { replace: true });
        } else {
          logger.warn('[AuthCallback] No session after exchange');
          setError('Could not establish session. Please try signing in again.');
          setLoading(false);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        logger.error('Auth callback error:', err);
        setError(msg);
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {loading ? 'Completing Sign In...' : 'Authentication Error'}
          </CardTitle>
          <CardDescription>
            {loading 
              ? 'Please wait while we complete the authentication process.' 
              : error || 'Something went wrong during authentication.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          )}
          {!loading && (
            <button 
              onClick={() => navigate('/login')} 
              className="text-primary hover:underline"
            >
              Go to Sign In
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
