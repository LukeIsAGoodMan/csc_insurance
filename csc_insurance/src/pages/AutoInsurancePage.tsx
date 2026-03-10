import { ProductLandingTemplate } from "../components/templates/ProductLandingTemplate";
import { Rollup } from "../components/ui/Rollup";

export function AutoInsurancePage() {
  return (
    <ProductLandingTemplate
      h1="Auto insurance."
      subtitle="At CSC Insurance, we compare rates from multiple carriers to find you the best car insurance in Ontario."
      bottomCTATitle="Get a car insurance quote."
    >
      <Rollup title="Do I need car insurance?">
        <p>
          In Ontario, car insurance is mandatory. You must have a valid auto insurance policy before
          you can register a vehicle or drive on public roads. The minimum coverage includes
          third-party liability, accident benefits, direct compensation for property damage, and
          uninsured automobile coverage.
        </p>
      </Rollup>

      <Rollup title="What type of auto insurance coverage do I need?">
        <p>
          Beyond the mandatory minimum, you can add optional coverages such as collision,
          comprehensive (fire, theft, weather damage), increased accident benefits, and rental car
          coverage. Your broker can help determine the right mix based on your vehicle and driving
          habits.
        </p>
      </Rollup>

      <Rollup title="How much does car insurance cost?">
        <p>
          Premiums depend on many factors: your driving record, where you live, how far you commute,
          the type of vehicle you drive, your claims history, and available discounts. Working with
          an independent broker lets you compare across carriers for the most competitive rate.
        </p>
      </Rollup>

      <Rollup title="How do I get auto insurance?">
        <p>
          Fill out our quote form or call us directly. We will compare options from our network of
          insurance partners and walk you through the best coverage at the best price.
        </p>
      </Rollup>
    </ProductLandingTemplate>
  );
}
