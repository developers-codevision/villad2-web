import { Navbar, Footer } from "@/modules/shared/components";
import { RoomCard, RoomCardSkeleton } from "@/modules/client/components";
import { useRooms } from "@/modules/client/hooks/useRooms";
import { useLanguage } from "@/modules/client/contexts";
import { useEffect } from "react";

export default function Rooms() {
  const { availableRooms, loading, error } = useRooms();
  const { language, t } = useLanguage();

  // Schema para SEO
  useEffect(() => {
    if (availableRooms.length === 0) return;

    const roomsSchema = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Hostal Boutique Villa D2",
      "description": language === "es" 
        ? "Habitaciones confortales en el Vedado, La Habana" 
        : "Comfortable rooms in Vedado, Havana",
      "url": "https://villad2.com/habitaciones",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle 37 #14 e/Paseo y Calle 2",
        "addressLocality": "Vedado",
        "addressRegion": "La Habana",
        "addressCountry": "CU"
      },
      "amenityFeature": availableRooms.map(room => ({
        "@type": "LocationFeatureSpecification",
        "name": room.name,
        "description": room.description?.substring(0, 200),
        "value": room.capacity
      }))
    };

    let script = document.getElementById('rooms-schema') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'rooms-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(roomsSchema);
  }, [availableRooms, language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {t("rooms.title")}
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t("rooms.subtitle")}
          </p>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-muted-foreground">
                {t("rooms.error")}
              </p>
            </div>
          )}

          {!loading && !error && availableRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("rooms.noRooms")}
              </p>
            </div>
          )}

          {!loading && !error && availableRooms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
