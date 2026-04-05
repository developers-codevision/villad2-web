import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import PrivacyPolicySection from '@/modules/client/components/PrivacyPolicySection';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <PrivacyPolicySection />
      </main>
      <Footer />
    </div>
  );
}
