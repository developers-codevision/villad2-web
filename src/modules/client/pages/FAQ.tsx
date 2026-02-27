import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { FAQSection } from "@/modules/client/components";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

