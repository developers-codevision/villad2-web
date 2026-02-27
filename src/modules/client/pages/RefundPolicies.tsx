import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { RefundPoliciesSection } from "@/modules/client/components";

export default function RefundPolicies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <RefundPoliciesSection />
      </main>
      <Footer />
    </div>
  );
}

