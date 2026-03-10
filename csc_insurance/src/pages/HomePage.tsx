import { Link } from "react-router-dom";
import { GhostButton } from "../components/ui/GhostButton";
import { AnimateText } from "../components/ui/AnimateText";

const services = [
  { label: "Auto", path: "/auto-insurance", desc: "Car insurance coverage for Ontario drivers." },
  { label: "Property", path: "/home-insurance", desc: "Home, condo & tenant insurance." },
  { label: "Business", path: "/business-insurance", desc: "Commercial coverage for every industry." },
  { label: "Travel", path: "/travel-insurance", desc: "Emergency medical & trip protection." },
];

const partners = [
  "Aviva", "Intact", "Economical", "RSA", "CAA", "Gore Mutual",
  "Wawanesa", "SGI", "Travelers", "Pembridge", "Echelon", "Pafco",
  "Unica", "Coachman", "Jevco", "Chieftain",
];

export function HomePage() {
  return (
    <article>
      {/* ── Hero ── */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="Get the insurance coverage you need at the best price."
          className="max-w-[780px] text-display-hero font-semibold tracking-tighter text-primary"
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GhostButton to="/get-a-quote" variant="primary">
            Get Started
          </GhostButton>
        </div>
      </section>

      {/* ── Service Grid ── */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="grid gap-px rounded-2xl border border-border-light bg-border-light md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="group flex flex-col justify-between bg-canvas-bg p-10 transition-colors first:rounded-tl-2xl last:rounded-br-2xl hover:bg-white"
            >
              <h2 className="text-xl font-semibold tracking-tight">{s.label}</h2>
              <p className="mt-3 text-sm text-primary/40 leading-relaxed">{s.desc}</p>
              <span className="mt-6 text-xs font-medium text-accent-trust opacity-0 transition-opacity group-hover:opacity-100">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="border-t border-border-light py-20">
        <div className="mx-auto max-w-[1120px] px-6">
          <h2 className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-primary/30">
            A few of our success partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span key={p} className="text-sm text-primary/20 transition-colors hover:text-primary/50">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
