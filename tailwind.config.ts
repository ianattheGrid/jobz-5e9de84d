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
        background: "#121212", // Main background color (darker grey)
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FFFFFF", // Changed from red to white
          light: "#F3F3F3",
          dark: "#E5E5E5",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          light: "#F3F3F3",
        },
        card: {
          DEFAULT: "#1E1E1E", // Slightly lighter than background
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#282828", // Even lighter for contrast
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