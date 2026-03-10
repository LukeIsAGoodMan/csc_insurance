import { ProductLandingTemplate } from "../components/templates/ProductLandingTemplate";
import { Rollup } from "../components/ui/Rollup";

export function BusinessInsurancePage() {
  return (
    <ProductLandingTemplate
      h1="Business insurance."
      subtitle="At CSC Insurance, we tailor commercial coverage to protect your business from liability, property loss, and professional risk."
      bottomCTATitle="Get a commercial insurance quote."
    >
      <Rollup title="What is business insurance?">
        <p>
          Business insurance protects your company from financial losses caused by events like
          property damage, lawsuits, theft, employee injuries, and professional errors. The right
          policy ensures your operations, assets, and reputation are covered.
        </p>
      </Rollup>

      <Rollup title="Is commercial insurance required?">
        <p>
          While not always legally required, many contracts, landlords, and clients demand proof of
          insurance before doing business with you. Certain industries also have regulatory
          requirements for minimum coverage.
        </p>
      </Rollup>

      <Rollup title="What business insurance coverage do I need?">
        <p>
          Common coverages include Commercial General Liability (CGL), commercial auto, Errors &
          Omissions (E&O), business interruption, product liability, and cyber insurance. Your broker
          can build a package tailored to your industry and risk profile.
        </p>
      </Rollup>

      <Rollup title="How do I get commercial insurance?">
        <p>
          Start by filling out our quote form or contacting us directly. We will assess your business
          needs and compare options across multiple carriers to find the best fit.
        </p>
      </Rollup>
    </ProductLandingTemplate>
  );
}
