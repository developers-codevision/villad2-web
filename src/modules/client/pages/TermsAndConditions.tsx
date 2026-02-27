import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { TermsAndConditionsSection } from "@/modules/client/components";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <TermsAndConditionsSection />
      </main>
      <Footer />
    </div>
  );
}

