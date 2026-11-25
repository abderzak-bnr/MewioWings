/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff9433',
          500: '#ff7a00',
          600: '#e56d00',
          700: '#cc6200',
          800: '#9a3412',
          900: '#7c2d12',
        },
        espresso: {
          700: '#5c200e',
          800: '#4a190b',
          900: '#3d1408',
          950: '#2b0d05',
        },
        charcoal: {
          800: '#4a190b',
          900: '#3d1408',
          950: '#2b0d05',
        },
        brown: {
          DEFAULT: '#3d1408',
          hover: '#2b0d05',
          border: '#5c200e',
        },
        warmbg: '#f97316',
        surface: '#3d1408',
        border: '#5c200e',
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
        tajawal: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(234, 88, 12, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(234, 88, 12, 0.35)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
