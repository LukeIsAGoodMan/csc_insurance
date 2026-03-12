import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScenePulseContext, useScenePulseProvider } from "./hooks/useScenePulse";
import { GlobalCanvasManager } from "./components/three/GlobalCanvasManager";
import { MainLayout } from "./components/layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { AutoInsurancePage } from "./pages/AutoInsurancePage";
import { HomeInsurancePage } from "./pages/HomeInsurancePage";
import { BusinessInsurancePage } from "./pages/BusinessInsurancePage";
import { TravelInsurancePage } from "./pages/TravelInsurancePage";
import { PaymentPage } from "./pages/PaymentPage";
import { ETransferPage } from "./pages/ETransferPage";
import { PayDirectPage } from "./pages/PayDirectPage";
import { ClaimsPage } from "./pages/ClaimsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { QuotePage } from "./pages/QuotePage";
import { DisclosurePage } from "./pages/DisclosurePage";
import { PrivacyPage } from "./pages/PrivacyPage";

export default function App() {
  const pulseValue = useScenePulseProvider();

  return (
    <ScenePulseContext.Provider value={pulseValue}>
      <BrowserRouter>
        {/* Singleton canvas — lives outside Routes so rAF never pauses */}
        <GlobalCanvasManager />

        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="auto-insurance" element={<AutoInsurancePage />} />
            <Route path="home-insurance" element={<HomeInsurancePage />} />
            <Route path="business-insurance" element={<BusinessInsurancePage />} />
            <Route path="travel-insurance" element={<TravelInsurancePage />} />
            <Route path="make-a-payment" element={<PaymentPage />} />
            <Route path="e-transfer" element={<ETransferPage />} />
            <Route path="pay-direct" element={<PayDirectPage />} />
            <Route path="after-hours-claims" element={<ClaimsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="get-a-quote" element={<QuotePage />} />
            <Route path="disclosure-statement" element={<DisclosurePage />} />
            <Route path="privacy-policy" element={<PrivacyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ScenePulseContext.Provider>
  );
}
