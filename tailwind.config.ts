import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        "canvas-soft": "rgb(var(--canvas-soft) / <alpha-value>)",
        "canvas-elevated": "rgb(var(--canvas-elevated) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)"
      },
      fontFamily: {
        display: ["'Syne'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        panel: "0 20px 50px rgba(0, 0, 0, 0.28)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.05)",
        focus: "0 0 0 1px rgba(124, 199, 222, 0.45), 0 0 0 6px rgba(124, 199, 222, 0.12)"
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "36px 36px"
      },
      maxWidth: {
        "8xl": "90rem"
      },
      keyframes: {
        "pulse-line": {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "0.88" }
        },
        "scan-y": {
          "0%": { transform: "translateY(-8%)", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(108%)", opacity: "0" }
        }
      },
      animation: {
        "pulse-line": "pulse-line 3.2s ease-in-out infinite",
        "scan-y": "scan-y 5.5s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
