import { Rollup } from "../components/ui/Rollup";

export function DisclosurePage() {
  return (
    <article>
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-display-hero font-semibold tracking-tighter text-primary">
          Disclosure statement.
        </h1>
      </section>

      <section className="mx-auto max-w-[780px] px-6 pb-20">
        <Rollup title="Broker commissions" defaultOpen>
          <p>
            CSC Insurance earns commission from the insurance companies we represent. Commission
            rates vary by product line: auto insurance commissions typically range from 5% to 12.5%,
            and property insurance commissions range from 12.5% to 20%.
          </p>
        </Rollup>

        <Rollup title="Contingent commissions">
          <p>
            In addition to standard commissions, CSC Insurance may participate in contingent
            commission or profit-sharing arrangements with insurance companies. These are typically
            based on annual performance metrics such as premium volume and claims experience.
          </p>
        </Rollup>

        <Rollup title="Changes to compensation">
          <p>
            Should there be any material changes to our compensation structure, we will notify
            affected clients. If you have questions about our compensation, please contact us.
          </p>
        </Rollup>
      </section>
    </article>
  );
}
