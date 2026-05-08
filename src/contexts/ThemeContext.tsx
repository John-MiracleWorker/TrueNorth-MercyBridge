import { logger } from '@/lib/logger';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './SafeAuthProvider';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

function normalizeTheme(value: string | null | undefined): Theme {
  if (value === 'auto') return 'system';
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return 'system';
}

function getTimeOfDayTheme(date = new Date()): 'light' | 'dark' {
  const hour = date.getHours();
  return hour >= 6 && hour < 19 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getTimeOfDayTheme());
  const [isLoading, setIsLoading] = useState(true);

  const getActualTheme = (themeValue: Theme): 'light' | 'dark' => {
    if (themeValue === 'system') {
      return systemTheme;
    }
    return themeValue;
  };

  const actualTheme = getActualTheme(theme);

  const applyTheme = (themeValue: Theme) => {
    const root = window.document.documentElement;
    const resolvedTheme = getActualTheme(themeValue);

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  };

  useEffect(() => {
    const loadThemePreference = async () => {
      if (!user?.id) {
        let savedTheme: Theme | null = null;
        try {
          savedTheme = normalizeTheme(localStorage.getItem('theme'));
        } catch {
          // localStorage may be unavailable
        }
        const defaultTheme = savedTheme || 'system';
        setThemeState(defaultTheme);
        applyTheme(defaultTheme);
        setIsLoading(false);
        return;
      }

      try {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        const userTheme = normalizeTheme(preferences?.theme);
        setThemeState(userTheme);
        applyTheme(userTheme);
      } catch (error) {
        logger.error('Failed to load theme preference:', error);
        let savedTheme: Theme | null = null;
        try {
          savedTheme = normalizeTheme(localStorage.getItem('theme'));
        } catch {
          // localStorage may be unavailable
        }
        const fallbackTheme = savedTheme || 'system';
        setThemeState(fallbackTheme);
        applyTheme(fallbackTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [user?.id]);

  useEffect(() => {
    if (theme !== 'system') return;

    const updateSystemTheme = () => {
      const nextTheme = getTimeOfDayTheme();
      setSystemTheme((currentTheme) => {
        if (currentTheme === nextTheme) return currentTheme;
        return nextTheme;
      });
    };

    updateSystemTheme();
    const intervalId = window.setInterval(updateSystemTheme, 60_000);
    document.addEventListener('visibilitychange', updateSystemTheme);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', updateSystemTheme);
    };
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemTheme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // localStorage may be unavailable
    }

    if (user?.id) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            id: user.id,
            theme: newTheme,
          });
      } catch (error) {
        logger.error('Failed to save theme preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
