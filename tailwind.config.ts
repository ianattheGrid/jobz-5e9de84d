
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        "brand-pink": "hsl(var(--brand-pink))",
        "brand-purple": "hsl(var(--brand-purple))",
        "brand-blue": "hsl(var(--brand-blue))",
      },
      keyframes: {
        "card-swipe": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(var(--swipe-x))" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "twinkle-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))" },
          "50%": { filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 1))" },
        },
        "shooting-star": {
          "0%": { 
            transform: "translateX(0) translateY(0)",
            opacity: "1"
          },
          "70%": { opacity: "1" },
          "100%": { 
            transform: "translateX(-300px) translateY(300px)",
            opacity: "0"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "typewriter": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "typewriter-2": {
          "0%": { width: "0", opacity: "0" },
          "0.1%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
        "typewriter-3": {
          "0%": { width: "0", opacity: "0" },
          "0.1%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
        "typewriter-4": {
          "0%": { width: "0", opacity: "0" },
          "0.1%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
        "blink": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
      },
      animation: {
        "card-swipe": "card-swipe 0.5s ease-in-out",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "twinkle-slow": "twinkle-slow 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shooting-star": "shooting-star 3s linear infinite",
        "float": "float 5s ease-in-out infinite",
        "typewriter": "typewriter 5s steps(120, end) forwards",
        "typewriter-2": "typewriter-2 5s steps(120, end) 5s forwards",
        "typewriter-3": "typewriter-3 5s steps(120, end) 10s forwards",
        "typewriter-4": "typewriter-4 5s steps(120, end) 15s forwards",
        "fade-in-delayed-1": "fade-in 0.5s ease-out 5s forwards",
        "fade-in-delayed-2": "fade-in 0.5s ease-out 5.5s forwards",
        "fade-in-delayed-3": "fade-in 0.5s ease-out 6s forwards",
        "blink": "blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
