import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppTheme = 'orkut' | 'classic';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  returnToClassic: () => void;
  setOrkutTheme: () => void;
  isOrkut: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'aurenstar_active_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'classic' || saved === 'orkut') {
        return saved as AppTheme;
      }
    } catch {
      // ignore
    }
    // Default to 'orkut' as requested by the user ("aplica apenas as cores inspirado no orkut")
    return 'orkut';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'orkut' ? 'classic' : 'orkut');
  };

  const returnToClassic = () => {
    setTheme('classic');
  };

  const setOrkutTheme = () => {
    setTheme('orkut');
  };

  useEffect(() => {
    if (theme === 'orkut') {
      document.documentElement.classList.add('theme-orkut');
      document.body.classList.add('theme-orkut');
      document.body.style.backgroundColor = '#C9E5FF';
      document.body.style.color = '#172B4D';
    } else {
      document.documentElement.classList.remove('theme-orkut');
      document.body.classList.remove('theme-orkut');
      document.body.style.backgroundColor = '#C9E5FF';
      document.body.style.color = '#172B4D';
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        returnToClassic,
        setOrkutTheme,
        isOrkut: theme === 'orkut',
      }}
    >
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
