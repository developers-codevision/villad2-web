import { Users, BedDouble, Bath, CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { ImageWithPlaceholder } from "@/modules/shared/components";
import { RoomDetailSkeleton } from "@/modules/client/components";
import { useRoom } from "@/modules/client/hooks/useRooms";
import { parseAmenities, parsePhotos } from "@/modules/client/utils/roomHelpers";
import { roomsService } from "@/modules/shared/services/rooms.service";
import { ReservationForm } from '@/modules/client/components/reservation';
import { useClientReservation } from '@/modules/client/hooks/useClientReservation';
import { usePrices } from '@/modules/shared/hooks';
import { useParams, useNavigate, Link } from "react-router-dom";
import { RoomStatus } from "@/modules/shared/types/api.types";
import { useEffect } from "react";
import { useLanguage } from "@/modules/client/contexts";
import { parseBilingualText, parseBilingualList } from "@/modules/client/utils/bilingualHelpers";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, loading, error } = useRoom(id ? parseInt(id) : 0);
  const { language, t } = useLanguage();

  // Usar el mismo hook de reservas para una única fuente de verdad
  const { prices } = usePrices();
  const reservationHook = useClientReservation(prices);

  // Set the room when loaded
  useEffect(() => {
    if (room) {
      reservationHook.selectRoom(room.id);
    }
  }, [room]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <RoomDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-20 px-4 text-center flex items-center justify-center min-h-screen pt-16">
          <div>
            <h1 className="text-2xl font-bold mb-4">{error || t("room.notFound")}</h1>
            <Button onClick={() => navigate("/habitaciones")}>{t("room.viewRooms")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (room.status !== RoomStatus.VACIA_LIMPIA) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-20 px-4 text-center flex items-center justify-center min-h-screen pt-16">
          <div>
            <h1 className="text-2xl font-bold mb-4">{t("room.notAvailable")}</h1>
            <p className="text-muted-foreground mb-4">{t("room.notAvailableDesc")}</p>
            <Button onClick={() => navigate("/habitaciones")}>{t("room.viewAvailable")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the main image from mainPhoto array or use a placeholder
  const mainPhotoArray = parsePhotos(room.mainPhoto);
  const mainImage = mainPhotoArray.length > 0
    ? roomsService.getMediaUrl(mainPhotoArray[0])
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop';

  // Parse additional photos and convert to full URLs
  const additionalPhotos = parsePhotos(room.additionalPhotos).map(photo => roomsService.getMediaUrl(photo));
  const capacity = room.baseCapacity + room.extraCapacity;
  
  // Parse bilingual description
  const description = parseBilingualText(room.description, language);
  
  // Parse bilingual amenities
  const roomAmenitiesRaw = parseAmenities(room.roomAmenities);
  const bathroomAmenitiesRaw = parseAmenities(room.bathroomAmenities);
  const roomAmenities = parseBilingualList(roomAmenitiesRaw.join(','), language);
  const bathroomAmenities = parseBilingualList(bathroomAmenitiesRaw.join(','), language);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20">
        {/* Hero */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden mt-16">
          <ImageWithPlaceholder
            src={mainImage}
            alt={room.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
                onClick={() => navigate("/habitaciones")}
              >
                <ChevronLeft size={16} /> {t("room.allRooms")}
              </Button>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">#{room.id} : {room.name}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{description}</p>
              <div className="flex items-center gap-4 mt-4">

                <span className="flex items-center gap-1 text-white/80">
                  <Users size={16} /> {t("room.upTo")} {capacity} {capacity === 1 ? t("room.person") : t("room.persons")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-12">
          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {roomAmenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BedDouble size={22} className="text-[#00c3ff]" /> {t("room.includes")}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {roomAmenities.map((a, index) => (
                    <div key={index} className="flex items-center gap-2 bg-accent/50 rounded-lg px-4 py-3">
                      <CheckCircle size={16} className="text-[#00c3ff] shrink-0" />
                      <span className="text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {bathroomAmenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Bath size={22} className="text-[#00c3ff]" /> {t("room.bathroom")}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {bathroomAmenities.map((a, index) => (
                    <div key={index} className="flex items-center gap-2 bg-accent/50 rounded-lg px-4 py-3">
                      <CheckCircle size={16} className="text-[#00c3ff] shrink-0" />
                      <span className="text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking form - Usar ReservationForm con calendario integrado */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {t("room.bookRoom")} <span className="text-primary">{t("room.room")}</span>
            </h2>
            {/* ReservationForm incluye el calendario y toda la lógica de reserva */}
            <ReservationForm hook={reservationHook} rooms={room ? [room] : []} singleRoomId={room?.id} />
          </section>

          {/* Gallery */}
          {additionalPhotos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                {t("room.morePhotos")} <span className="text-primary">{t("room.photos")}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {additionalPhotos.map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                    <ImageWithPlaceholder
                      src={img}
                      alt={`${room.name} - foto ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Services CTA */}
          <section className="text-center py-12 mb-8 bg-accent/30 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("room.services")} <span className="text-primary">{t("nav.services")}</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t("room.servicesDesc")}
            </p>
            <Link to="/servicios">
              <Button size="lg" className="font-semibold text-lg px-8">
                {t("room.exploreServices")} <ArrowRight size={18} />
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}