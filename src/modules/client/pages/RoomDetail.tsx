import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, BedDouble, Bath, CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Calendar } from "@/modules/shared/components/ui/calendar";
import { Label } from "@/modules/shared/components/ui/label";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { ImageWithPlaceholder } from "@/modules/shared/components";
import { RoomDetailSkeleton } from "@/modules/client/components";
import { useRoom } from "@/modules/client/hooks/useRooms";
import { parseAmenities, parsePhotos } from "@/modules/client/utils/roomHelpers";
import { roomsService } from "@/modules/shared/services/rooms.service";
import ReservationForm from '@/modules/client/components/ReservationForm';
import { useClientReservation } from '@/modules/client/hooks/useClientReservation';
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, loading, error } = useRoom(id ? parseInt(id) : 0);

  const capacity = room.baseCapacity + room.extraCapacity
  // Usar el mismo hook de reservas para una única fuente de verdad
  const reservationHook = useClientReservation();

  // Set the room when loaded
  useEffect(() => {
    if (room) {
      reservationHook.selectRoom(room.id);
    }
  }, [room, reservationHook.selectRoom]);

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
            <h1 className="text-2xl font-bold mb-4">{error || "Habitación no encontrada"}</h1>
            <Button onClick={() => navigate("/habitaciones")}>Ver habitaciones</Button>
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
                <ChevronLeft size={16} /> Todas las habitaciones
              </Button>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{room.name}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{room.description}</p>
              <div className="flex items-center gap-4 mt-4">

                <span className="flex items-center gap-1 text-white/80">
                  <Users size={16} /> Hasta {capacity} {capacity === 1 ? "persona" : "personas"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-12">
          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {(() => {
              const roomAmenities = parseAmenities(room.roomAmenities);
              return roomAmenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BedDouble size={22} className="text-primary" /> Amenities de la Habitación
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {roomAmenities.map((a, index) => (
                      <div key={index} className="flex items-center gap-2 bg-accent/50 rounded-lg px-4 py-3">
                        <CheckCircle size={16} className="text-primary shrink-0" />
                        <span className="text-sm font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {(() => {
              const bathroomAmenities = parseAmenities(room.bathroomAmenities);
              return bathroomAmenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Bath size={22} className="text-primary" /> Amenities del Baño
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {bathroomAmenities.map((a, index) => (
                      <div key={index} className="flex items-center gap-2 bg-accent/50 rounded-lg px-4 py-3">
                        <CheckCircle size={16} className="text-primary shrink-0" />
                        <span className="text-sm font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Booking form - Reutilizar ReservationForm para eliminar duplicación */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Reserva esta <span className="text-primary">Habitación</span>
            </h2>
            {/* Calendar con lógica de días ocupados unificada */}
            <div className="space-y-2 mb-8">
              <Label className="text-base">Fechas de estancia</Label>
              <div className="border border-border rounded-lg p-6 flex justify-center overflow-x-auto">
                <Calendar
                  mode="range"
                  selected={{
                    from: reservationHook.formData.checkIn,
                    to: reservationHook.formData.checkOut,
                  }}
                  onSelect={(r) => reservationHook.setDateRange(r?.from, r?.to)}
                  numberOfMonths={2}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || reservationHook.occupiedDates.includes(format(d, 'yyyy-MM-dd'))}
                  locale={es}
                  className="pointer-events-auto"
                />
              </div>
              {reservationHook.formData.checkIn && reservationHook.formData.checkOut && (
                <p className="text-sm text-muted-foreground text-center">
                  {format(reservationHook.formData.checkIn, "dd MMM yyyy", { locale: es })} — {format(reservationHook.formData.checkOut, "dd MMM yyyy", { locale: es })}
                </p>
              )}
            </div>
            {/* Usar ReservationForm para reutilizar lógica y UI */}
            <ReservationForm hook={reservationHook} rooms={room ? [room] : []} singleRoomId={room?.id} />
          </section>

          {/* Gallery */}
          {additionalPhotos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Más <span className="text-primary">Fotos</span>
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
              Descubre nuestros <span className="text-primary">Servicios</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Tours guiados, alquiler de bicicletas, traslados al aeropuerto y mucho más para que tu estancia sea perfecta.
            </p>
            <Link to="/servicios">
              <Button size="lg" className="font-semibold text-lg px-8">
                Explorar Servicios <ArrowRight size={18} />
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}