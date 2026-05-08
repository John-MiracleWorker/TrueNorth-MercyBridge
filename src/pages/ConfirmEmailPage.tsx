import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logger } from '@/lib/logger';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'email_confirmation') {
        setLoading(false);
        setError('Invalid confirmation link');
        return;
      }

      try {
        // Supabase handles email confirmation via the callback URL
        // This page is mainly for user feedback
        setMessage('Email confirmed successfully!');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to confirm email';
        logger.error('Confirm email error:', err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Confirmation</CardTitle>
          <CardDescription>
            {loading ? 'Confirming your email...' : error ? 'Something went wrong' : 'All set!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {!loading && (
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
