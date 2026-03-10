import { Rollup } from "../components/ui/Rollup";
import { AnimateText } from "../components/ui/AnimateText";

export function ETransferPage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <AnimateText
          text="Send an e-transfer."
          className="text-display-hero font-semibold tracking-tighter text-primary"
        />
        <p className="mt-4 max-w-[520px] text-base text-primary/40">
          Follow the instructions below to pay your CSC Insurance invoice via Interac e-Transfer.
        </p>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <Rollup title="Recipient email" defaultOpen>
          <p className="font-mono text-sm">payment@cscinsurance.ca</p>
        </Rollup>

        <Rollup title="Amount" defaultOpen>
          <p>Enter the total amount shown on your invoice.</p>
        </Rollup>

        <Rollup title="Message / memo" defaultOpen>
          <p>
            Include your <strong>customer number</strong>, <strong>policy number</strong>, and{" "}
            <strong>name of the insured</strong> so we can apply your payment correctly.
          </p>
        </Rollup>

        <div className="mt-10 rounded-xl border border-border-light p-6 text-sm text-primary/40">
          Questions? Email us at{" "}
          <a href="mailto:payment@cscinsurance.ca" className="text-accent-trust underline">
            payment@cscinsurance.ca
          </a>
        </div>
      </section>
    </article>
  );
}
