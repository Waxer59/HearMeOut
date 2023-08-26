/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx', '*.html'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)'
      }
    }
  },
  plugins: []
};
