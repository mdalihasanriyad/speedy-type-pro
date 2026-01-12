import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, themes, getThemeById, applyTheme } from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'triwebic-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    return savedThemeId ? getThemeById(savedThemeId) : themes[0];
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (themeId: string) => {
    const newTheme = getThemeById(themeId);
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
