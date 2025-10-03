import { useEffect, useState } from 'react';

const STORAGE_KEY = 'trackit:theme';

const getInitialPreference = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return stored === 'dark';
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useDarkMode = () => {
    const [isDark, setIsDark] = useState(getInitialPreference);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            window.localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            window.localStorage.setItem(STORAGE_KEY, 'light');
        }
    }, [isDark]);

    useEffect(() => {
        if (!window.matchMedia) {
            return undefined;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (event) => {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                setIsDark(event.matches);
            }
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const toggle = () => setIsDark((prev) => !prev);

    return { isDark, toggle, setIsDark };
};
