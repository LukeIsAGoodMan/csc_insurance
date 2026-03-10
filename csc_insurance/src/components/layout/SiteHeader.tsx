import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { navigation } from "../../theme.config";

export function SiteHeader() {
  const scrolled = useScrollPosition(50);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-canvas-bg/70" : "bg-transparent"
      }`}
    >
      {/* Flowing iridescent border — animated gradient replaces static border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(123,111,224,0.25) 20%, rgba(167,139,250,0.5) 50%, rgba(96,165,250,0.25) 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: scrolled ? "shimmer-border 4s linear infinite" : "none",
        }}
      />

      <nav className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tighter text-primary">
          CSC Insurance
        </Link>

        {/* Desktop nav with capsule slider */}
        <LayoutGroup>
          <ul className="hidden items-center gap-1 md:flex">
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
                          layoutId="nav-capsule"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(123, 111, 224, 0.08)",
                            border: "1px solid rgba(123, 111, 224, 0.12)",
                          }}
                          transition={{
                            type: "spring" as const,
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          isActive
                            ? "text-accent-trust font-medium"
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
        <ul className="flex flex-col gap-1 bg-canvas-bg/95 px-6 pb-6 pt-2 backdrop-blur-xl">
          {navigation.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm ${
                    isActive ? "text-accent-trust font-medium" : "text-primary/60"
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
