/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: "#FBFBFB",
        },
        primary: "#1D1D1F",
        "accent-trust": "#1D3C34",
        "border-light": "rgba(0,0,0,0.05)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-hero": [
          "clamp(3rem, 5vw, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
      },
      letterSpacing: {
        tighter: "-0.022em",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        "slide-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-collapsible-content-height, auto)", opacity: "1" },
        },
        "slide-up": {
          from: { height: "var(--radix-collapsible-content-height, auto)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.15" },
        },
      },
      animation: {
        "slide-down": "slide-down 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-up": "slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "skeleton-pulse": "skeleton-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
