/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A192F',
          800: '#0F2744',
          700: '#1E3A8A',
        },
        sky: {
          500: '#0284C7',
          400: '#38BDF8',
          100: '#E0F2FE',
        },
        gold: {
          500: '#D97706',
          400: '#F59E0B',
          100: '#FEF3C7',
        }
      }
    },
  },
  plugins: [],
}
