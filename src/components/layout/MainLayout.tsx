import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PageTransition } from "../ui/PageTransition";
import { NebulaBackground } from "../three/NebulaBackground";
import { GridBackground } from "../ui/GridBackground";

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* CSS nebula gradient — fixed behind everything */}
      <NebulaBackground />
      <GridBackground />

      {/* Skip to content — a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-trust focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="relative flex-1 pt-[60px]">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  );
}
