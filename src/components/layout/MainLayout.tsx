import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PageTransition } from "../ui/PageTransition";
import { NebulaBackground } from "../three/NebulaBackground";
import { GlobalCanvasManager } from "../three/GlobalCanvasManager";
import { ScenePulseContext, useScenePulseProvider } from "../../hooks/useScenePulse";

export function MainLayout() {
  const location = useLocation();
  const pulseValue = useScenePulseProvider();

  return (
    <ScenePulseContext.Provider value={pulseValue}>
    <div className="relative flex min-h-screen flex-col">
      {/* CSS nebula gradient — fixed behind everything */}
      <NebulaBackground />

      {/* Singleton WebGL Canvas — one context for all 3D scenes */}
      <GlobalCanvasManager />

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
    </ScenePulseContext.Provider>
  );
}
