import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { GhostButton } from "../components/ui/GhostButton";
import { GlassCard } from "../components/ui/GlassCard";
import { Rollup } from "../components/ui/Rollup";

const AutoHero3D = lazy(() =>
  import("../components/three/AutoHero3D").then((m) => ({ default: m.AutoHero3D })),
);

const sellingPoints = [
  {
    title: "Multi-carrier comparison",
    desc: "We compare rates from 15+ insurance companies to find your best price.",
  },
  {
    title: "Mandatory coverage included",
    desc: "Third-party liability, accident benefits, DCPD, and uninsured auto — all built in.",
  },
  {
    title: "Optional protection",
    desc: "Collision, comprehensive, rental car, increased accident benefits, and more.",
  },
  {
    title: "Discount hunting",
    desc: "Bundle discounts, clean driving records, winter tires — we find every saving.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

export function AutoInsurancePage() {
  return (
    <article>
      {/* ── Hero with 3D Shield ── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="w-full max-w-[600px]">
            <Suspense fallback={null}>
              <AutoHero3D />
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
            Auto insurance.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 max-w-[520px] text-base text-primary/45 leading-relaxed"
          >
            At CSC Insurance, we compare rates from multiple carriers to find you the best car
            insurance in Ontario.
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

      {/* ── Glassmorphism Cards ── */}
      <section className="mx-auto max-w-[1120px] px-6 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {sellingPoints.map((point) => (
            <motion.div key={point.title} variants={cardVariants}>
              <GlassCard className="h-full">
                <div className="p-8">
                  <h3 className="text-lg font-semibold tracking-tight text-primary">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm text-primary/45 leading-relaxed">{point.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ Rollups ── */}
      <section className="mx-auto max-w-[780px] px-6 pb-16">
        <Rollup title="Do I need car insurance?">
          <p>
            In Ontario, car insurance is mandatory. You must have a valid auto insurance policy
            before you can register a vehicle or drive on public roads. The minimum coverage includes
            third-party liability, accident benefits, direct compensation for property damage, and
            uninsured automobile coverage.
          </p>
        </Rollup>
        <Rollup title="What type of auto insurance coverage do I need?">
          <p>
            Beyond the mandatory minimum, you can add optional coverages such as collision,
            comprehensive (fire, theft, weather damage), increased accident benefits, and rental car
            coverage. Your broker can help determine the right mix based on your vehicle and driving
            habits.
          </p>
        </Rollup>
        <Rollup title="How much does car insurance cost?">
          <p>
            Premiums depend on many factors: your driving record, where you live, how far you
            commute, the type of vehicle you drive, your claims history, and available discounts.
            Working with an independent broker lets you compare across carriers for the most
            competitive rate.
          </p>
        </Rollup>
        <Rollup title="How do I get auto insurance?">
          <p>
            Fill out our quote form or call us directly. We will compare options from our network of
            insurance partners and walk you through the best coverage at the best price.
          </p>
        </Rollup>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border-light py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          Get a car insurance quote.
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
