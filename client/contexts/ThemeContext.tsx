'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type Theme = 'modern' | 'minimal';
const THEME_KEY = 'elevare-theme';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme || 'modern');
  const { update } = useSession();

  // Sync from localStorage on mount
  useEffect(() => {
    if (!initialTheme) {
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }, [initialTheme]);

  // Sync with new initialTheme if session updates
  useEffect(() => {
    if (initialTheme) {
      setThemeState(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, [initialTheme]);

  // Always update DOM + localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    try {
      const res = await fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });

      if (res.ok) {
        //  Refresh session so session.user.themePreference updates
      update();
      }
    } catch (err) {
      console.error('Failed to update theme in DB:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
