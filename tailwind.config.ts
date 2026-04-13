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
        "mbank-green": "#009C4D",
        "mbank-gold":  "#FABF00",
        "mbank-teal":  "#007E8B",
        "mbank-page":  "#F2F2F2",
        "mbank-card":  "#FFFFFF",
        "mbank-text":  "#111111",
        "mbank-sub":   "#999999",
        "mbank-divider": "#E8E8E8",
        "mbank-inactive": "#8C8C8C",
        "mbank-error": "#E53E3E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        item: "12px",
        icon: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)",
        "green-icon": "0 2px 8px rgba(0,156,77,0.22)",
        "green-btn":  "0 4px 16px rgba(0,156,77,0.28)",
        "gold-fab":   "0 4px 16px rgba(250,191,0,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.2s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
