import { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PageTransition } from "../ui/PageTransition";

const NebulaBackground = lazy(() =>
  import("../three/NebulaBackground").then((m) => ({ default: m.NebulaBackground })),
);

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ultra-subtle 3D nebula mesh gradient — fixed behind everything */}
      <Suspense fallback={null}>
        <NebulaBackground />
      </Suspense>

      {/* Skip to content — a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-trust focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="relative z-10 flex-1 pt-[60px]">
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
