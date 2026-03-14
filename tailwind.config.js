/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "Manrope", "sans-serif"],
        manrope: ["manrope", "sans-serif"],
        harry: ["harryP", "serif"],
        wizard: ["blackchancery", "serif"],
      },
      KeyframeEffects: {
        "fade-in": {
          "0%": { opacity: "0" },
        },
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
    },
    plugins: [],
  },
};
