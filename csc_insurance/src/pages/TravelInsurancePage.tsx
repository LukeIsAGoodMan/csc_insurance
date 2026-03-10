import { motion } from "framer-motion";
import { GhostButton } from "../components/ui/GhostButton";
import { Rollup } from "../components/ui/Rollup";
import { AnimateText } from "../components/ui/AnimateText";

/**
 * Travel Insurance — "The Crystal Globe"
 * Interactive 3D wireframe earth replaces old template filler.
 */
export function TravelInsurancePage() {
  return (
    <article>
      {/* ── Hero (3D rendered by GlobalCanvasManager) ── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="relative z-10 text-center">
          <AnimateText
            text="Travel insurance."
            className="text-display-hero font-semibold tracking-tighter text-primary"
            delay={0.4}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto mt-6 max-w-[520px] text-base text-primary/45 leading-relaxed"
          >
            Travel with confidence — emergency medical coverage, trip cancellation protection, and
            peace of mind wherever you go.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
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

      {/* ── FAQ sections ── */}
      <section className="mx-auto max-w-[780px] px-6 pb-16">
        <Rollup title="Do I need travel insurance?">
          <p>
            Ontario&apos;s provincial health plan (OHIP) does not cover medical expenses outside of
            Canada. Travel insurance protects you from potentially devastating costs for emergency
            medical treatment, hospitalization, dental emergencies, ambulance services, and medical
            evacuation while abroad.
          </p>
        </Rollup>

        <Rollup title="What type of travel insurance should I get?">
          <p>
            The two main categories are emergency medical insurance and trip
            cancellation/interruption insurance. Emergency medical covers unexpected illness or
            injury while traveling. Trip cancellation reimburses non-refundable expenses if you need
            to cancel or cut short your trip for covered reasons.
          </p>
        </Rollup>

        <Rollup title="How much does travel insurance cost?">
          <p>
            Premiums vary based on your age, trip duration, destination, coverage limits, and
            pre-existing medical conditions. A single-trip policy for a healthy adult can start at
            just a few dollars per day — a small price for significant financial protection.
          </p>
        </Rollup>

        <Rollup title="How do I get travel insurance?">
          <p>
            Submit a quote request or contact us directly. We will help you compare options and find
            the right coverage for your next trip.
          </p>
        </Rollup>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border-light py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          Get a travel insurance quote.
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
