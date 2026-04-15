import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import CookiePolicySection from '@/modules/client/components/CookiePolicySection';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <CookiePolicySection />
      </main>
      <Footer />
    </div>
  );
}
