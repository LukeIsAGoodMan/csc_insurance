import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useRouteColor } from "../../hooks/useRouteColor";
import { navigation } from "../../theme.config";

/* ────────────────────────────────────────────────────────────
   PremiumHeader — "The Lens of Insurance"

   Material:   backdrop-blur(48px) + bg-white/2% + inner glow bevel
   Slider:     MagneticNavPill — layoutId + stiffness:400 / damping:30
   Border:     0.5px iridescent line synced with NebulaBackground colors
   ──────────────────────────────────────────────────────────── */

function toRgba(c: [number, number, number], a: number) {
  return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
}

export function SiteHeader() {
  const scrolled = useScrollPosition(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { col1, col2, col3 } = useRouteColor();

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-[48px]" : ""
      }`}
      style={{
        background: scrolled ? "rgba(255,255,255,0.02)" : "transparent",
        boxShadow: scrolled
          ? "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 20px rgba(0,0,0,0.03)"
          : "none",
      }}
    >
      {/* ── 0.5px iridescent border — synced with nebula route colors ── */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-opacity duration-500"
        style={{
          height: "0.5px",
          opacity: scrolled ? 1 : 0.3,
          background: `linear-gradient(90deg, transparent 0%, ${toRgba(col1, 0.4)} 25%, ${toRgba(col2, 0.6)} 50%, ${toRgba(col3, 0.4)} 75%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer-border 4s linear infinite",
        }}
      />

      <nav className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tighter text-primary">
          CSC Insurance
        </Link>

        {/* Desktop nav — Magnetic Pill Slider */}
        <LayoutGroup>
          <ul className="hidden items-center gap-0.5 md:flex">
            {navigation.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="relative block px-4 py-1.5 text-sm tracking-wide"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(123, 111, 224, 0.08)",
                            border: "1px solid rgba(123, 111, 224, 0.12)",
                            boxShadow: "0 0 12px rgba(123, 111, 224, 0.06)",
                          }}
                          transition={{
                            type: "spring" as const,
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          isActive
                            ? "font-medium text-accent-trust"
                            : "text-primary/60 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </LayoutGroup>

        {/* CTA */}
        <Link
          to="/get-a-quote"
          className="hidden rounded-full border border-accent-trust px-5 py-2 text-xs font-medium tracking-wide text-accent-trust transition-colors duration-200 hover:bg-accent-trust hover:text-white md:block"
        >
          Get a Quote
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-px w-5 bg-primary transition-transform duration-300 ${
              mobileOpen ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-primary transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-primary transition-transform duration-300 ${
              mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-spring md:hidden ${
          mobileOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 bg-white/[0.03] px-6 pb-6 pt-2 backdrop-blur-[48px]">
          {navigation.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm ${
                    isActive ? "font-medium text-accent-trust" : "text-primary/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-2">
            <Link
              to="/get-a-quote"
              onClick={() => setMobileOpen(false)}
              className="inline-block rounded-full border border-accent-trust px-5 py-2 text-xs font-medium text-accent-trust"
            >
              Get a Quote
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
