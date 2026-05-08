import { useCallback } from 'react';

export function useHaptic() {
  const haptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    // No-op for web - Capacitor haptics only work on native platforms
    void type;
  }, []);

  return { haptic };
}
