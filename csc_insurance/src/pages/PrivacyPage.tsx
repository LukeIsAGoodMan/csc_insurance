import { motion } from "framer-motion";
import { Rollup } from "../components/ui/Rollup";
import {
  LegalGlassContainer,
  LegalSection,
} from "../components/ui/LegalGlassContainer";

export function PrivacyPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-display-hero font-semibold tracking-tighter text-primary"
        >
          Privacy policy.
        </motion.h1>
      </section>

      <LegalGlassContainer>
        <LegalSection>
          <Rollup title="Information we collect" defaultOpen>
            <p>
              When you use our website or request a quote, we may collect personal information such
              as your name, email address, phone number, and details relevant to your insurance
              inquiry. We also collect device information through cookies and analytics tools.
            </p>
          </Rollup>
        </LegalSection>

        <LegalSection>
          <Rollup title="How we use your information">
            <p>
              Your information is used to process insurance quotes, communicate with you about your
              policy or inquiry, and improve our services. We do not sell your personal information
              to third parties.
            </p>
          </Rollup>
        </LegalSection>

        <LegalSection>
          <Rollup title="Analytics">
            <p>
              This site uses Google Analytics to understand how visitors interact with our website.
              This data helps us improve our services and user experience. You may opt out of Google
              Analytics tracking by installing the Google Analytics opt-out browser add-on.
            </p>
          </Rollup>
        </LegalSection>

        <LegalSection>
          <Rollup title="Contact us about privacy">
            <p>
              If you have questions or concerns about how we handle your personal information,
              please contact us at{" "}
              <a href="mailto:info@cscinsurance.ca" className="text-accent-trust underline">
                info@cscinsurance.ca
              </a>
              .
            </p>
          </Rollup>
        </LegalSection>
      </LegalGlassContainer>

      <div className="pb-20" />
    </article>
  );
}
