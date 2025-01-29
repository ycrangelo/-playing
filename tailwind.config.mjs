/** @type {import('tailwindcss').Config} */
// tailwind.config.js
const {heroui} = require("@heroui/react");
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
     extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
