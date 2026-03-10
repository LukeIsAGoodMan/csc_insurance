import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { GhostButton } from "../components/ui/GhostButton";
import { Rollup } from "../components/ui/Rollup";

const DataOrbit3D = lazy(() =>
  import("../components/three/DataOrbit3D").then((m) => ({ default: m.DataOrbit3D })),
);

export function BusinessInsurancePage() {
  return (
    <article>
      {/* ── Hero with 3D Orbit ── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="w-full max-w-[600px]">
            <Suspense fallback={null}>
              <DataOrbit3D />
            </Suspense>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-[780px] text-display-hero font-semibold tracking-tighter text-primary"
          >
            Business insurance.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 max-w-[520px] text-base text-primary/45 leading-relaxed"
          >
            At CSC Insurance, we tailor commercial coverage to protect your business from liability,
            property loss, and professional risk.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <GhostButton to="/get-a-quote" variant="primary">
              Let&apos;s get started
            </GhostButton>
            <GhostButton to="/get-a-quote" variant="secondary">
              Start
            </GhostButton>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Rollups ── */}
      <section className="mx-auto max-w-[780px] px-6 pb-16">
        <Rollup title="What is business insurance?">
          <p>
            Business insurance protects your company from financial losses caused by events like
            property damage, lawsuits, theft, employee injuries, and professional errors. The right
            policy ensures your operations, assets, and reputation are covered.
          </p>
        </Rollup>
        <Rollup title="Is commercial insurance required?">
          <p>
            While not always legally required, many contracts, landlords, and clients demand proof of
            insurance before doing business with you. Certain industries also have regulatory
            requirements for minimum coverage.
          </p>
        </Rollup>
        <Rollup title="What business insurance coverage do I need?">
          <p>
            Common coverages include Commercial General Liability (CGL), commercial auto, Errors &
            Omissions (E&O), business interruption, product liability, and cyber insurance. Your
            broker can build a package tailored to your industry and risk profile.
          </p>
        </Rollup>
        <Rollup title="How do I get commercial insurance?">
          <p>
            Start by filling out our quote form or contacting us directly. We will assess your
            business needs and compare options across multiple carriers to find the best fit.
          </p>
        </Rollup>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border-light py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          Get a commercial insurance quote.
        </h2>
        <div className="mt-8">
          <GhostButton to="/get-a-quote" variant="primary">
            Start
          </GhostButton>
        </div>
      </section>
    </article>
  );
}
