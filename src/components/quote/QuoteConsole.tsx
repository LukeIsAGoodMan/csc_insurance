import { useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useQuoteEngine, STEP_LABELS } from "./useQuoteEngine";
import { PremiumTicker } from "./PremiumTicker";
import { useScenePulse } from "../../hooks/useScenePulse";
import { AnimateText } from "../ui/AnimateText";

/* ────────────────────────────────────────────────────────────
   QuoteConsole — "Glass Console" multi-step intake.

   Material:  Glassmorphism 2.0 (blur-60 + bg-white/3% + border-white/20)
   Tilt:      ±2deg perspective rotation via useSpring
   Steps:     AnimatePresence push-pull (x:50 → 0 → -50)
   Ticker:    Live PremiumTicker updates on every field change
   3D:        triggerPulse() on step advance
   ──────────────────────────────────────────────────────────── */

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-primary outline-none backdrop-blur-sm transition-all focus:border-accent-trust/40 focus:bg-white/[0.06]";

const SELECT_CLASS = `${INPUT_CLASS} appearance-none`;

const LABEL_CLASS = "block text-xs font-medium tracking-wide text-primary/40 mb-1.5";

const stepTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

/* ── Province options ── */
const PROVINCES = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NB", label: "New Brunswick" },
  { value: "NS", label: "Nova Scotia" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NL", label: "Newfoundland & Labrador" },
];

const VEHICLE_YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i);

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV / Crossover" },
  { value: "truck", label: "Truck" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];

const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Less than 1 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3\u20134 years" },
  { value: "5", label: "5\u20139 years" },
  { value: "10", label: "10+ years" },
];

const ACCIDENT_OPTIONS = [
  { value: "0", label: "None" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3 or more" },
];

export function QuoteConsole() {
  const { step, formData, setField, nextStep, prevStep, premium, canAdvance } = useQuoteEngine();
  const { triggerPulse } = useScenePulse();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Interactive Tilt ── */
  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springX, [-1, 1], [2, -2]);
  const rotateY = useTransform(springY, [-1, 1], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    springX.set(y);
    springY.set(x);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  const handleNext = () => {
    nextStep();
    triggerPulse();
  };

  /* ── Step renderers ── */
  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="qc-province" className={LABEL_CLASS}>Province</label>
              <select
                id="qc-province"
                value={formData.province}
                onChange={(e) => setField("province", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Select province...</option>
                {PROVINCES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="qc-city" className={LABEL_CLASS}>City</label>
              <input
                id="qc-city"
                type="text"
                value={formData.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="e.g. Toronto"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="qc-year" className={LABEL_CLASS}>Vehicle year</label>
              <select
                id="qc-year"
                value={formData.vehicleYear}
                onChange={(e) => setField("vehicleYear", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Select year...</option>
                {VEHICLE_YEARS.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="qc-type" className={LABEL_CLASS}>Vehicle type</label>
              <select
                id="qc-type"
                value={formData.vehicleType}
                onChange={(e) => setField("vehicleType", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Select type...</option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="qc-age" className={LABEL_CLASS}>Driver age</label>
              <input
                id="qc-age"
                type="number"
                min="16"
                max="99"
                value={formData.driverAge}
                onChange={(e) => setField("driverAge", e.target.value)}
                placeholder="e.g. 30"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="qc-exp" className={LABEL_CLASS}>Years of driving experience</label>
              <select
                id="qc-exp"
                value={formData.experience}
                onChange={(e) => setField("experience", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Select...</option>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="qc-acc" className={LABEL_CLASS}>At-fault accidents (last 6 years)</label>
              <select
                id="qc-acc"
                value={formData.accidents}
                onChange={(e) => setField("accidents", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Select...</option>
                {ACCIDENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-primary/40">Province</div>
              <div className="font-medium">{formData.province}</div>
              <div className="text-primary/40">City</div>
              <div className="font-medium">{formData.city || "\u2014"}</div>
              <div className="text-primary/40">Vehicle</div>
              <div className="font-medium">{formData.vehicleYear} {formData.vehicleType}</div>
              <div className="text-primary/40">Driver age</div>
              <div className="font-medium">{formData.driverAge}</div>
              <div className="text-primary/40">Experience</div>
              <div className="font-medium">{formData.experience}+ years</div>
              <div className="text-primary/40">Accidents</div>
              <div className="font-medium">{formData.accidents}</div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-primary/30">
                Estimated monthly premium
              </p>
              <PremiumTicker value={premium} className="mt-2 text-4xl" />
              <p className="mt-1 text-xs text-primary/30">per month</p>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-full border border-accent-trust px-8 py-3 text-sm font-medium text-accent-trust transition-colors hover:bg-accent-trust hover:text-white"
            >
              Submit quote request
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <article>
      {/* ── Hero headline ── */}
      <section className="flex min-h-[28vh] flex-col items-center justify-end px-6 pb-6 text-center">
        <AnimateText
          text="Get a quote."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
      </section>

      {/* ── Glass Console ── */}
      <section className="relative z-[8] mx-auto max-w-[640px] px-6 pb-20">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1200,
            rotateX,
            rotateY,
          }}
          className="rounded-3xl border border-white/20 p-8 md:p-10"
          data-glass="true"
        >
          {/* Glass background layer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
              background: "rgba(255, 255, 255, 0.03)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 4px 40px rgba(0,0,0,0.04)",
            }}
          />

          {/* Content (above glass layer) */}
          <div className="relative z-10">
            {/* Step Progress */}
            <div className="mb-8 flex items-center justify-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => i < step && prevStep()}
                    className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all ${
                      i === step
                        ? "bg-accent-trust/10 text-accent-trust"
                        : i < step
                          ? "text-primary/40 hover:text-primary/60"
                          : "text-primary/20"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        i < step
                          ? "bg-accent-trust text-white"
                          : i === step
                            ? "border border-accent-trust text-accent-trust"
                            : "border border-primary/15 text-primary/20"
                      }`}
                    >
                      {i < step ? "\u2713" : i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                  {i < 3 && (
                    <div
                      className={`h-px w-4 transition-colors ${
                        i < step ? "bg-accent-trust/30" : "bg-primary/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step title */}
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-primary">
              {STEP_LABELS[step]}
            </h2>

            {/* Animated step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={stepTransition}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 3 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`text-sm text-primary/40 transition-colors hover:text-primary/70 ${
                    step === 0 ? "invisible" : ""
                  }`}
                >
                  &larr; Back
                </button>

                {/* Live ticker (visible during form steps) */}
                <div className="text-right">
                  {premium > 0 && (
                    <div className="mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-primary/25">
                        Est. monthly
                      </span>
                      <br />
                      <PremiumTicker value={premium} className="text-lg" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className={`rounded-full border px-6 py-2 text-sm font-medium transition-all ${
                    canAdvance
                      ? "border-accent-trust text-accent-trust hover:bg-accent-trust hover:text-white"
                      : "border-primary/10 text-primary/20 cursor-not-allowed"
                  }`}
                >
                  {step === 2 ? "Review" : "Next"} &rarr;
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </article>
  );
}
