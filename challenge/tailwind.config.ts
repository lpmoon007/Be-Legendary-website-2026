import type { Config } from "tailwindcss";

// Be Legendary design system — tokens map 1:1 to the CSS custom properties
// declared in app/globals.css so class names and raw CSS stay in sync.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#15130E",
        card: "#F4F0E7",
        "card-light": "#FBF8F1",
        "dark-nav": "rgba(21,19,14,0.85)",
        ink: {
          heading: "#1B1810",
          body: "#2E2A22",
          muted: "#8A7F6C",
          light: "#F4F0E7",
        },
        accent: {
          DEFAULT: "#C04A26",
          hover: "#9E3A1C",
          light: "#E0744A",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "Hanken Grotesk", "system-ui", "sans-serif"],
      },
      // Numeric weight utilities (font-400 … font-800) to match the two
      // variable fonts' loaded weights.
      fontWeight: {
        "400": "400",
        "500": "500",
        "600": "600",
        "700": "700",
        "800": "800",
      },
      borderRadius: {
        card: "20px",
        btn: "10px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 30px 70px -30px rgba(0,0,0,0.6)",
        cta: "0 14px 34px -14px rgba(192,74,38,0.7)",
      },
      maxWidth: {
        shell: "1160px",
      },
    },
  },
  plugins: [],
};

export default config;
