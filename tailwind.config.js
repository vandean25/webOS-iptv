/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
       colors: {
        "primary": "var(--primary)",
        "background-light": "var(--background-light)",
        "background-dark": "var(--background-dark)",
        "surface-dark": "var(--surface-dark)",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
      boxShadow: {
        'glow': '0 0 20px -5px rgba(19, 91, 236, 0.5)',
      }
    },
  },
  plugins: [],
}
