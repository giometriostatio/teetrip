/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1a1a2e',
        'charcoal-light': '#232340',
        'masters-green': '#006747',
        'masters-green-light': '#008c5f',
        gold: '#c9a84c',
        'gold-light': '#d4b85a',
        'soft-red': '#c0392b',
        'soft-red-light': '#e74c3c',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
