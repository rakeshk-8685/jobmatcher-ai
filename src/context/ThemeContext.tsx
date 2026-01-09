// ============================================
// Theme Context - Dark/Light/System Theme
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    resolvedTheme: ResolvedTheme;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'jobmatcher_theme';

function getSystemTheme(): ResolvedTheme {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
    if (mode === 'system') {
        return getSystemTheme();
    }
    return mode;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
            return stored || 'system';
        }
        return 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(mode));

    // Apply theme to document
    useEffect(() => {
        const resolved = resolveTheme(mode);
        setResolvedTheme(resolved);

        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
    }, [mode]);

    // Listen for system theme changes
    useEffect(() => {
        if (mode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            setResolvedTheme(getSystemTheme());
            document.documentElement.setAttribute('data-theme', getSystemTheme());
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(getSystemTheme());
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(THEME_STORAGE_KEY, newMode);
    }, []);

    const toggleTheme = useCallback(() => {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setMode(modes[nextIndex]);
    }, [mode, setMode]);

    return (
        <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggleTheme }}>
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

export default ThemeContext;
