import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        brand: {
          50: "#f3f6ff",
          100: "#e3e9ff",
          200: "#c7d2ff",
          300: "#a4b2ff",
          400: "#7b8bff",
          500: "#5566ff",
          600: "#3944e6",
          700: "#2d34b3",
          800: "#242b8a",
          900: "#1f266f",
        },
        night: "#0b1021",
        parchment: "#f8f5ec",
      },
      backgroundImage: {
        "radial-dots":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(85,102,255,0.35), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 80% 80%, rgba(255,185,115,0.25), transparent 35%)",
      },
      boxShadow: {
        card: "0 20px 60px -24px rgba(0,0,0,0.24)",
        glow: "0 10px 30px rgba(85,102,255,0.3)",
      },
      animation: {
        "slow-spin": "spin 24s linear infinite",
        "pulse-glow": "pulseGlow 3.6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.55, filter: "blur(40px)" },
          "50%": { opacity: 0.9, filter: "blur(52px)" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;




