/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forge: {
          950: '#06080C',
          900: '#0B0E14',
          850: '#10141D',
          800: '#161B26',
          700: '#1E2535',
          600: '#2A3348',
          border: '#2C2B29',
          gold: {
            light: '#F5C869',
            DEFAULT: '#E5A93C',
            dark: '#B88220',
            glow: 'rgba(229, 169, 60, 0.2)',
          },
          amber: '#D4AF37',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 25px -5px rgba(229, 169, 60, 0.25)',
        'gold-lg': '0 0 35px -3px rgba(229, 169, 60, 0.35)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}

