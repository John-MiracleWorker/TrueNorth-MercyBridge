import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SafeAuthProvider } from '@/contexts/SafeAuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { queryClient } from '@/lib/query-client';
import { MercyBridgeLayout } from '@/components/MercyBridgeLayout';
import { RoleGate } from '@/components/RoleGate';

// Auth redirect - all auth goes through TrueNorth hub
const LoginRedirect = lazy(() => import('@/pages/LoginRedirect'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));

// MercyBridge pages
const MercyBridgeLanding = lazy(() => import('@/pages/MercyBridgeLanding'));
const BrowseNeeds = lazy(() => import('@/pages/BrowseNeeds'));
const NeedDetail = lazy(() => import('@/pages/NeedDetail'));
const RequestHelp = lazy(() => import('@/pages/RequestHelp'));
const MercyBridgeAdmin = lazy(() => import('@/pages/MercyBridgeAdmin'));
const RequesterDashboard = lazy(() => import('@/pages/RequesterDashboard'));
const SponsorDashboard = lazy(() => import('@/pages/SponsorDashboard'));
const StewardshipCoach = lazy(() => import('@/pages/StewardshipCoach'));

function renderRoute(element: ReactNode, message?: string): ReactNode {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{message || 'Loading...'}</p>
        </div>
      </div>
    }>
      {element}
    </Suspense>
  );
}

function withProtected(element: ReactNode): ReactNode {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

function withMercyBridgeLayout(element: ReactNode): ReactNode {
  return <MercyBridgeLayout>{element}</MercyBridgeLayout>;
}

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAuthProvider>
        <ThemeProvider>
          <div className="min-h-screen text-foreground animate-in fade-in duration-700">
            <main id="main-content">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {/* All auth routes redirect to TrueNorth hub login */}
                  <Route path="/login" element={renderRoute(<LoginRedirect />, 'Redirecting...')} />
                  <Route path="/register" element={renderRoute(<LoginRedirect />, 'Redirecting...')} />
                  <Route path="/reset-password" element={renderRoute(<LoginRedirect />, 'Redirecting...')} />
                  <Route path="/confirm-email" element={renderRoute(<LoginRedirect />, 'Redirecting...')} />
                  <Route path="/auth/callback" element={renderRoute(<AuthCallbackPage />, 'Completing sign in...')} />

                  {/* MercyBridge Routes */}
                  <Route
                    path="/"
                    element={renderRoute(
                      withMercyBridgeLayout(<MercyBridgeLanding />),
                      'Loading MercyBridge...'
                    )}
                  />
                  <Route
                    path="/browse"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<BrowseNeeds />)),
                      'Loading needs...'
                    )}
                  />
                  <Route
                    path="/need/:id"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<NeedDetail />)),
                      'Loading need details...'
                    )}
                  />
                  <Route
                    path="/request-help"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<RequestHelp />)),
                      'Loading request form...'
                    )}
                  />
                  <Route
                    path="/admin"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<RoleGate><MercyBridgeAdmin /></RoleGate>)),
                      'Loading admin...'
                    )}
                  />
                  <Route
                    path="/dashboard"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<RequesterDashboard />)),
                      'Loading dashboard...'
                    )}
                  />
                  <Route
                    path="/sponsor-dashboard"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<SponsorDashboard />)),
                      'Loading sponsor dashboard...'
                    )}
                  />
                  <Route
                    path="/stewardship"
                    element={renderRoute(
                      withProtected(withMercyBridgeLayout(<StewardshipCoach />)),
                      'Loading stewardship coach...'
                    )}
                  />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </ThemeProvider>
      </SafeAuthProvider>
    </QueryClientProvider>
  );
}

export default App;