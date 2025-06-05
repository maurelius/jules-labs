import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Key for localStorage
const THEME_STORAGE_KEY = 'dd_golf_theme_preference';

export function ThemeProvider({ children }) {
    // Initialize state from localStorage, fallback to false (light mode) if not set
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    // Update localStorage whenever theme changes
    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Optional: Sync with system preferences
    useEffect(() => {
        // Check if user has no saved preference
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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