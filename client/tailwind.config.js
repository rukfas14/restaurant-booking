/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fbf7f3',
          100: '#f0e7dc',
          200: '#e7ddd2',
          300: '#d8c8b8',
          500: '#b54a30',
          600: '#8c2f1f',
          800: '#4a2e1f',
          900: '#2b1d16',
        },
      },
    },
  },
  plugins: [],
};
