import { logger } from '@/lib/logger';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cookieStorage } from '@/lib/cookieStorage';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isBanned: boolean;
  isPermanentlyBanned: boolean;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SafeAuthProviderProps {
  children: ReactNode;
}

function getLegacyCrossDomainSession(): string | null {
  try {
    const match = document.cookie.match(/(^| )truenorth_session=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

// Legacy fallback: if the hub still mirrors the session into a `truenorth_session`
// cookie (instead of using cookieStorage on Supabase directly), copy it into the
// canonical `sb-<ref>-auth-token` cookie that Supabase reads.
function importLegacySessionCookie() {
  try {
    const legacyValue = getLegacyCrossDomainSession();
    if (!legacyValue) return false;

    const url = import.meta.env.VITE_SUPABASE_URL || '';
    const match = url.match(/https:\/\/([^.]+)/);
    if (!match) return false;
    const authKey = `sb-${match[1]}-auth-token`;

    if (!cookieStorage.getItem(authKey)) {
      cookieStorage.setItem(authKey, legacyValue);
      console.info('[Auth] Legacy session imported from truenorth_session cookie');
    }
    return true;
  } catch (err) {
    console.error('[Auth] Failed to import legacy session cookie:', err);
    return false;
  }
}

function AuthProviderContent({ children }: SafeAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [isPermanentlyBanned, setIsPermanentlyBanned] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkBannedStatus = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_banned, banned_reason')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          logger.warn('[Auth] Failed to check ban status:', error.message);
          return;
        }

        if (profile?.is_banned) {
          if (mounted) setIsBanned(true);
          
          const { data: deniedAppeal } = await supabase
            .from('moderation_appeals')
            .select('id')
            .eq('user_id', userId)
            .eq('appeal_type', 'ban')
            .eq('status', 'denied')
            .maybeSingle();

          if (mounted && deniedAppeal) {
            setIsPermanentlyBanned(true);
          } else if (mounted) {
            setIsPermanentlyBanned(false);
          }

          const notice =
            (profile.banned_reason && String(profile.banned_reason).trim()) ||
            'Your account has been disabled.';
          try {
            sessionStorage.setItem('banned_notice', notice);
          } catch {
            // ignore storage errors
          }
        } else {
          if (mounted) {
            setIsBanned(false);
            setIsPermanentlyBanned(false);
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.warn('[Auth] Ban check error:', message);
      }
    };

    const initializeAuth = async () => {
      try {
        // Backward-compat: pull a legacy `truenorth_session` cookie into the
        // canonical Supabase cookie before reading the session.
        importLegacySessionCookie();

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting initial session:', error);
        }
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);

          if (initialSession?.user?.id) {
            void checkBannedStatus(initialSession.user.id);
          }
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (session?.user?.id) {
            void checkBannedStatus(session.user.id);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      logger.error('Error signing out:', error);
    }
  };

  const logout = signOut;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    logout,
    isLoggedIn: !!user,
    isBanned,
    isPermanentlyBanned,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function SafeAuthProvider({ children }: SafeAuthProviderProps) {
  if (typeof React === 'undefined' || !React || !React.useState) {
    logger.error('React is not available in SafeAuthProvider');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Application</h1>
          <p className="text-gray-600">Please wait while we initialize...</p>
        </div>
      </div>
    );
  }

  return <AuthProviderContent>{children}</AuthProviderContent>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SafeAuthProvider');
  }
  return context;
}
