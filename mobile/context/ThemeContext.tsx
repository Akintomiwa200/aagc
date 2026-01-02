import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load saved theme or use system preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('church_app_theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        } else {
          const colorScheme: ColorSchemeName = Appearance.getColorScheme();
          setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (e) {
        console.error('Error loading theme:', e);
      }
    };

    loadTheme();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('church_app_theme').then((savedTheme) => {
        if (!savedTheme) {
          setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        }
      });
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Save theme preference
    AsyncStorage.setItem('church_app_theme', theme).catch(console.error);
  }, [theme]);

  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#000000' : '#F9FAFB',
    text: isDark ? '#FFFFFF' : '#111827',
    card: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? '#374151' : '#E5E7EB',
    primary: '#7C3AED',
    secondary: isDark ? '#9CA3AF' : '#6B7280',
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
