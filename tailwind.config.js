/** @type {import('tailwindcss').Config} */
// tailwind.config.js [cite: 350]
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ['Figtree', 'sans-serif'],
        display: ['Zalando Sans SemiExpanded', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'], // Sets Poppins as the default
      },
      colors: {
        brandGold: '#C6A85C',
        darkBg: '#0a0a0d',
      }
    },
  },
  plugins: [],
}