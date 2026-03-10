import { motion } from "framer-motion";
import { Rollup } from "../components/ui/Rollup";
import {
  LegalGlassContainer,
  LegalSection,
} from "../components/ui/LegalGlassContainer";

export function DisclosurePage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-display-hero font-semibold tracking-tighter text-primary"
        >
          Disclosure statement.
        </motion.h1>
      </section>

      <LegalGlassContainer>
        <LegalSection>
          <Rollup title="Broker commissions" defaultOpen>
            <p>
              CSC Insurance earns commission from the insurance companies we represent. Commission
              rates vary by product line: auto insurance commissions typically range from 5% to
              12.5%, and property insurance commissions range from 12.5% to 20%.
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
