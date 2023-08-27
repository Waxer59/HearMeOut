/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx', '*.html'],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)'
      }
    }
  },
  plugins: []
};
