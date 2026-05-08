import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase PKCE flow handles the code exchange automatically
        // We just need to check if the session is established
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          navigate('/', { replace: true });
        } else {
          // Check for code in URL (PKCE flow)
          const code = searchParams.get('code');
          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
            navigate('/', { replace: true });
          } else {
            setError('Authentication failed. Please try again.');
            setLoading(false);
          }
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
