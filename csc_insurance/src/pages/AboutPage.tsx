import { GhostButton } from "../components/ui/GhostButton";

export function AboutPage() {
  return (
    <article>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-[780px] text-display-hero font-semibold tracking-tighter text-primary">
          About us.
        </h1>
        <p className="mt-6 max-w-[560px] text-base text-primary/45 leading-relaxed">
          Making insurance simple for every stage of your life.
        </p>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <div className="space-y-6 text-primary/55 leading-relaxed">
          <p>
            CSC Insurance is an independent insurance brokerage serving the Greater Toronto Area.
            We partner with multiple Canadian insurance companies to find you the best coverage
            at competitive prices.
          </p>
          <p>
            Our team covers auto, property, commercial, and travel insurance. We are proud to
            serve our clients in English, Cantonese, and Mandarin.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <GhostButton to="/get-a-quote" variant="primary">
            Get Started
          </GhostButton>
          <GhostButton to="/contact" variant="secondary">
            Chat with us
          </GhostButton>
        </div>
      </section>
    </article>
  );
}
