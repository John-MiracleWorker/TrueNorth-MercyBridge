import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRoutePrefetch() {
  const navigate = useNavigate();

  const prefetch = useCallback((route: string) => {
    void route;
  }, []);

  const prefetchAndNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  return { prefetch, prefetchAndNavigate };
}

// Standalone function for direct import
export function prefetchRoute(route: string) {
  void route;
}
