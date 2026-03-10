import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { GhostButton } from "../components/ui/GhostButton";
import { Rollup } from "../components/ui/Rollup";
import { AnimateText } from "../components/ui/AnimateText";

const HomePrism3D = lazy(() =>
  import("../components/three/HomePrism3D").then((m) => ({ default: m.HomePrism3D })),
);

export function HomeInsurancePage() {
  return (
    <article>
      {/* ── Hero with 3D Prism ── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="w-full max-w-[600px]">
            <Suspense fallback={null}>
              <HomePrism3D />
            </Suspense>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <AnimateText
            text="Property insurance."
            className="max-w-[780px] text-display-hero font-semibold tracking-tighter text-primary"
            delay={0.3}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 max-w-[520px] text-base text-primary/45 leading-relaxed"
          >
            At CSC Insurance, we help homeowners, condo owners, and tenants protect what matters
            most.
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
        <Rollup title="Do I need home insurance?">
          <p>
            While not legally required in Ontario, home insurance is typically mandatory if you have
            a mortgage. Landlords may also require tenant insurance as a condition of your lease.
            Even without these requirements, property insurance protects your home and belongings
            from unexpected loss.
          </p>
        </Rollup>
        <Rollup title="What type of property insurance coverage do I need?">
          <p>
            Coverage tiers include named perils (specific events listed in your policy), broad form
            (building covered against all risks except exclusions; contents on named perils), and
            comprehensive (all-risk for both building and contents). Your broker can recommend the
            right level based on your property and circumstances.
          </p>
        </Rollup>
        <Rollup title="How much does home insurance cost?">
          <p>
            Your premium is influenced by factors like the replacement cost of your home, its
            location, age and condition, your claims history, and the coverage level you choose.
            Bundling home and auto insurance often qualifies you for a discount.
          </p>
        </Rollup>
        <Rollup title="How do I get home insurance?">
          <p>
            Submit a quote request or give us a call. We will compare policies across our partner
            carriers and help you find the right coverage at a competitive price.
          </p>
        </Rollup>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border-light py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          Get a home insurance quote.
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
