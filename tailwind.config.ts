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
        border: "#333333",
        input: "#333333",
        ring: "#666666",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#ea384c",
          light: "#ff6b7d",
          dark: "#d41f33",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          light: "#F3F3F3",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#999999",
        },
        accent: {
          DEFAULT: "#333333",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
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