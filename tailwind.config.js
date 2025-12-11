/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1e1e1e',
        primary: '#e50914', // Netflix-like red, or stick to neutral
        text: '#e5e5e5',
        'brand-dark': '#141414',
        'brand-secondary-dark': '#1E1E1E',
        'brand-gray': '#2D2D2D',
        'brand-light-gray': '#A0A0A0',
      },
      boxShadow: {
        'glow': '0 0 15px 5px rgba(255, 255, 255, 0.3)',
      },
      spacing: {
        'safe-area': '5%',
      }
    },
  },
  plugins: [],
}
