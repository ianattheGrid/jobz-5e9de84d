import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#ea384c",
          light: "#ff6b7d",
          dark: "#d41f33",
        },
        secondary: {
          DEFAULT: "#F97316",
          light: "#FFEDD5",
        },
      },
      keyframes: {
        "card-swipe": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(var(--swipe-x))" },
        },
      },
      animation: {
        "card-swipe": "card-swipe 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;