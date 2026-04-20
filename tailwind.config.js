/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f8f6f4",
          100: "#efe8de",
          200: "#dfd0be",
          300: "#cfb79d",
          400: "#be9f7d",
          500: "#a88862",
          600: "#8f704d",
          700: "#765840",
          800: "#5e4033",
          900: "#452826",
        },
      },
    },
  },
  plugins: [],
};