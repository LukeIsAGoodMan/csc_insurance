import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { navigation } from "../../theme.config";

export function SiteHeader() {
  const scrolled = useScrollPosition(50);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-canvas-bg/70 border-b border-border-light"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tighter text-primary">
          CSC Insurance
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navigation.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-accent-trust font-medium"
                      : "text-primary/60 hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

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
          mobileOpen ? "max-h-[400px] border-b border-border-light" : "max-h-0"
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
