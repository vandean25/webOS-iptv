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
      },
      spacing: {
        'safe-area': '5%',
      }
    },
  },
  plugins: [],
}
