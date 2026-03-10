import { ProductLandingTemplate } from "../components/templates/ProductLandingTemplate";
import { ComingSoon } from "../components/ui/ComingSoon";

/**
 * Travel Insurance page.
 * Template filler text from the original site has been removed per audit.
 * Replaced with Coming Soon skeleton until real content is provided.
 */
export function TravelInsurancePage() {
  return (
    <ProductLandingTemplate
      h1="Travel insurance."
      subtitle="At CSC Insurance, we help you travel with confidence — emergency medical, trip cancellation, and more."
      bottomCTATitle="Get a travel insurance quote."
    >
      {/* Original template placeholder content stripped — audit item resolved */}
      <ComingSoon label="Detailed travel insurance content coming soon" />
    </ProductLandingTemplate>
  );
}
