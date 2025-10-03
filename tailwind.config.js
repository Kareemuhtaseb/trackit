import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import theme from './resources/js/theme.js';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                ...theme.colors,
            },
            fontFamily: {
                sans: [...theme.fontFamily.sans, ...defaultTheme.fontFamily.sans],
                display: [...theme.fontFamily.display, ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                ...theme.boxShadow,
            },
            borderRadius: {
                ...theme.borderRadius,
            },
        },
    },

    plugins: [forms],
};
