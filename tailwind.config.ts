import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        blush: {
          50: "#fef7f7",
          100: "#fdeef0",
          200: "#fbdce2",
          300: "#f7c0cb",
          400: "#f094a8",
          500: "#e56b85",
          600: "#d14a68",
          700: "#b03551",
          800: "#932f47",
          900: "#7c2b40",
        },
        cream: {
          50: "#fefdfb",
          100: "#fdf9f3",
          200: "#faf3e6",
          300: "#f5e8d0",
          400: "#eed5ad",
          500: "#e4bc84",
          600: "#d4a05c",
          700: "#b88347",
          800: "#966a3d",
          900: "#7a5734",
        },
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-heart": "pulse-heart 1.5s ease-in-out infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "bounce-soft": "bounce-soft 0.6s ease-out",
        "grow": "grow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-heart": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-soft": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.15)" },
          "60%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        grow: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(var(--scale, 1.2))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
