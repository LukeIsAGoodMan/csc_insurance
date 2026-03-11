/**
 * CSC Insurance — "Blank Canvas Aesthetics" Design Tokens
 *
 * Single source of truth for all visual primitives.
 * Consumed by Tailwind via tailwind.config.js and directly in components
 * where Tailwind classes aren't sufficient (inline spring physics, etc.).
 */

// ─── Colors ──────────────────────────────────────────────────────────
export const colors = {
  canvasBg: "#FBFBFB",
  textPrimary: "#1D1D1F",
  textSecondary: "rgba(29, 29, 31, 0.55)",
  accentTrust: "#1D3C34", // Deep Forest Green
  accentTrustHover: "#2A5446",
  borderLight: "rgba(0, 0, 0, 0.05)",
  borderMedium: "rgba(0, 0, 0, 0.1)",
  white: "#FFFFFF",
  skeleton: "rgba(0, 0, 0, 0.06)",
} as const;

// ─── Typography ──────────────────────────────────────────────────────
export const typography = {
  fontStack: [
    "Inter",
    "SF Pro Display",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ].join(", "),
  hero: {
    size: "clamp(3rem, 5vw, 5rem)", // 48px → 80px fluid
    lineHeight: 1.05,
    letterSpacing: "-0.022em",
    weight: 600,
  },
  h2: {
    size: "clamp(1.5rem, 3vw, 2.25rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.018em",
    weight: 600,
  },
  body: {
    size: "1.0625rem", // 17px
    lineHeight: 1.65,
    weight: 400,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────
export const spacing = {
  headerHeight: "60px",
  sectionGap: "clamp(4rem, 8vw, 8rem)",
  contentMaxWidth: "1120px",
  heroMaxWidth: "780px",
} as const;

// ─── Motion ──────────────────────────────────────────────────────────
export const motion = {
  springEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  rollupDuration: 400, // ms
  headerBlurThreshold: 50, // px scroll before header glass effect
} as const;

// ─── Navigation ──────────────────────────────────────────────────────
export const navigation = {
  items: [
    { label: "Auto", path: "/auto-insurance" },
    { label: "Home", path: "/home-insurance" },
    { label: "Business", path: "/business-insurance" },
    { label: "Travel", path: "/travel-insurance" },
    { label: "Payment", path: "/make-a-payment" },
    { label: "Claims", path: "/after-hours-claims" },
    { label: "About", path: "/about" },
  ],
} as const;
