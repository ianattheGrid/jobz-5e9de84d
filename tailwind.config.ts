
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
        background: "#FFFFFF",
        foreground: "#333333", // Darker text color for better readability
        primary: {
          DEFAULT: "#FF69B4",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          light: "#F3F3F3",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333", // Darker text color for better readability
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#555555", // Darker muted text color for better readability
        },
        accent: {
          DEFAULT: "#F0F0F0",
          foreground: "#333333", // Darker text color for better readability
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333", // Darker text color for better readability
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
