import { Rollup } from "../components/ui/Rollup";
import { AnimateText } from "../components/ui/AnimateText";
import { NumberTicker } from "../components/ui/NumberTicker";
import {
  LegalGlassContainer,
  LegalSection,
} from "../components/ui/LegalGlassContainer";

export function DisclosurePage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="Disclosure statement."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
      </section>

      <LegalGlassContainer>
        <LegalSection>
          <Rollup title="Broker commissions" defaultOpen>
            <p>
              CSC Insurance earns commission from the insurance companies we represent. Commission
              rates vary by product line: auto insurance commissions typically range
              from <NumberTicker value={5} decimals={0} suffix="%" /> to{" "}
              <NumberTicker value={12.5} suffix="%" />, and property insurance commissions range
              from <NumberTicker value={12.5} suffix="%" /> to{" "}
              <NumberTicker value={20} decimals={0} suffix="%" />.
            </p>
          </Rollup>
        </LegalSection>

        <LegalSection>
          <Rollup title="Contingent commissions">
            <p>
              In addition to standard commissions, CSC Insurance may participate in contingent
              commission or profit-sharing arrangements with insurance companies. These are typically
              based on annual performance metrics such as premium volume and claims experience.
            </p>
          </Rollup>
        </LegalSection>

        <LegalSection>
          <Rollup title="Changes to compensation">
            <p>
              Should there be any material changes to our compensation structure, we will notify
              affected clients. If you have questions about our compensation, please contact us.
            </p>
          </Rollup>
        </LegalSection>
      </LegalGlassContainer>

      <div className="pb-20" />
    </article>
  );
}
