import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import InterestPlacesList from "@/modules/shared/components/InterestPlacesList";

export default function InterestPlaces() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <InterestPlacesList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

