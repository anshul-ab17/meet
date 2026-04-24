import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#800020",
        "primary-hover": "#9a0028",
        secondary: "#5c0017",
        "secondary-hover": "#4a0012",
        // Cinema dark system (from UI/UX Pro Max: Modern Dark Cinema)
        "bg-base":    "#0d0d0f",
        "bg-surface": "#131316",
        "bg-sidebar": "#0a0a0c",
        "bg-server":  "#080809",
        "bg-input":   "#1a1a1f",
        "border-subtle": "#1f1f24",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(128,0,32,0.25)",
        "glow-md": "0 0 24px rgba(128,0,32,0.30)",
        "glow-lg": "0 0 48px rgba(128,0,32,0.20)",
        "glass":   "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-in":     { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out":    { from: { opacity: "1" }, to: { opacity: "0" } },
        "zoom-in-95":  { from: { transform: "scale(0.95)" }, to: { transform: "scale(1)" } },
        "zoom-out-95": { from: { transform: "scale(1)" }, to: { transform: "scale(0.95)" } },
        "slide-up":    { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "in":       "fade-in 0.15s cubic-bezier(0.16,1,0.3,1), zoom-in-95 0.15s cubic-bezier(0.16,1,0.3,1)",
        "out":      "fade-out 0.15s ease-in, zoom-out-95 0.15s ease-in",
        "slide-up": "slide-up 0.25s cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
