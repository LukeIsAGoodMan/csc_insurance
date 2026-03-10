import { ProductLandingTemplate } from "../components/templates/ProductLandingTemplate";
import { Rollup } from "../components/ui/Rollup";

export function HomeInsurancePage() {
  return (
    <ProductLandingTemplate
      h1="Property insurance."
      subtitle="At CSC Insurance, we help homeowners, condo owners, and tenants protect what matters most."
      bottomCTATitle="Get a home insurance quote."
    >
      <Rollup title="Do I need home insurance?">
        <p>
          While not legally required in Ontario, home insurance is typically mandatory if you have a
          mortgage. Landlords may also require tenant insurance as a condition of your lease. Even
          without these requirements, property insurance protects your home and belongings from
          unexpected loss.
        </p>
      </Rollup>

      <Rollup title="What type of property insurance coverage do I need?">
        <p>
          Coverage tiers include named perils (specific events listed in your policy), broad form
          (building covered against all risks except exclusions; contents on named perils), and
          comprehensive (all-risk for both building and contents). Your broker can recommend the
          right level based on your property and circumstances.
        </p>
      </Rollup>

      <Rollup title="How much does home insurance cost?">
        <p>
          Your premium is influenced by factors like the replacement cost of your home, its location,
          age and condition, your claims history, and the coverage level you choose. Bundling home
          and auto insurance often qualifies you for a discount.
        </p>
      </Rollup>

      <Rollup title="How do I get home insurance?">
        <p>
          Submit a quote request or give us a call. We will compare policies across our partner
          carriers and help you find the right coverage at a competitive price.
        </p>
      </Rollup>
    </ProductLandingTemplate>
  );
}
