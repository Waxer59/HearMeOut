/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx', '*.html'],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)',
        iris: 'var(--iris-color)'
      },
      animation: {
        slide: 'slide 0.5s ease',
        slideReverse: 'slideReverse 0.5s ease forwards'
      },
      keyframes: {
        slide: {
          '0%': { display: 'block', transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideReverse: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)', display: 'none' }
        }
      }
    }
  },
  plugins: []
};
