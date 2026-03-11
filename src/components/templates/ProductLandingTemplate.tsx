import type { ReactNode } from "react";
import { GhostButton } from "../ui/GhostButton";

interface ProductLandingTemplateProps {
  /** Semantic H1 for the page — every page gets a unique one */
  h1: string;
  /** Optional subtitle beneath the H1 */
  subtitle?: string;
  /** FAQ / collapsible sections rendered below the hero */
  children?: ReactNode;
  /** Show bottom CTA section */
  showBottomCTA?: boolean;
  bottomCTATitle?: string;
}

export function ProductLandingTemplate({
  h1,
  subtitle,
  children,
  showBottomCTA = true,
  bottomCTATitle = "Get a quote.",
}: ProductLandingTemplateProps) {
  return (
    <article>
      {/* ── Hero ── */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-[780px] text-display-hero font-semibold tracking-tighter text-primary">
          {h1}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-[520px] text-base text-primary/45 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GhostButton to="/get-a-quote" variant="primary">
            Let&apos;s get started
          </GhostButton>
          <GhostButton to="/get-a-quote" variant="secondary">
            Start
          </GhostButton>
        </div>
      </section>

      {/* ── Content sections (FAQ rollups, etc.) ── */}
      {children && (
        <section className="mx-auto max-w-[780px] px-6 pb-16">{children}</section>
      )}

      {/* ── Bottom CTA ── */}
      {showBottomCTA && (
        <section className="border-t border-border-light py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {bottomCTATitle}
          </h2>
          <div className="mt-8">
            <GhostButton to="/get-a-quote" variant="primary">
              Start
            </GhostButton>
          </div>
        </section>
      )}
    </article>
  );
}
