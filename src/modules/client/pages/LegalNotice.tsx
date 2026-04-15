import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import LegalNoticeSection from '@/modules/client/components/LegalNoticeSection';

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <LegalNoticeSection />
      </main>
      <Footer />
    </div>
  );
}
