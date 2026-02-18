import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Users, Wifi, Bath, CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Calendar } from "@/modules/shared/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { useRoom } from "@/modules/client/hooks/useRooms";
import { parseAmenities, parsePhotos } from "@/modules/client/utils/roomHelpers";
import type { DateRange } from "react-day-picker";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, loading, error } = useRoom(id ? parseInt(id) : 0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const checkIn = dateRange?.from;
  const checkOut = dateRange?.to;
  const nights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 0) : 0;
  const total = room ? nights * room.pricePerNight : 0;
  const canSubmit = checkIn && checkOut && nights > 0 && name && email && phone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) setConfirmed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando habitación...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Habitación no encontrada"}</h1>
          <Button onClick={() => navigate("/habitaciones")}>Ver habitaciones</Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the main image from mainPhoto array or use a placeholder
  const mainPhotoArray = parsePhotos(room.mainPhoto);
  const mainImage = mainPhotoArray.length > 0
    ? mainPhotoArray[0]
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop';

  // Parse additional photos
  const additionalPhotos = parsePhotos(room.additionalPhotos);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md">
            <CheckCircle size={64} className="text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground mb-2">
              Gracias, <strong>{name}</strong>. Tu reserva en <strong>{room.name}</strong> ha sido registrada.
            </p>
            <p className="text-muted-foreground mb-1">
              {checkIn && format(checkIn, "dd MMM yyyy", { locale: es })} — {checkOut && format(checkOut, "dd MMM yyyy", { locale: es })}
            </p>
            <p className="text-2xl font-bold text-primary mt-4">{total}€ total</p>
            <p className="text-sm text-muted-foreground mt-4">
              Recibirás un email de confirmación en <strong>{email}</strong>.
            </p>
            <Button className="mt-8 font-semibold" onClick={() => setConfirmed(false)}>
              Nueva Reserva
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={mainImage}
            alt={room.name}
            className="w-full h-full object-cover"
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
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-lg">
                  {room.pricePerNight}€/noche
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <Users size={16} /> Hasta {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
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
                    <Wifi size={22} className="text-primary" /> Amenities de la Habitación
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

          {/* Booking form */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Reserva esta <span className="text-primary">Habitación</span>
            </h2>

            <div className="space-y-2 mb-8">
              <Label className="text-base">Fechas de estancia</Label>
              <div className="border border-border rounded-lg p-6 flex justify-center overflow-x-auto">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(d) => d < new Date()}
                  locale={es}
                  className="pointer-events-auto"
                />
              </div>
              {checkIn && checkOut && (
                <p className="text-sm text-muted-foreground text-center">
                  {format(checkIn, "dd MMM yyyy", { locale: es })} — {format(checkOut, "dd MMM yyyy", { locale: es })} · {nights} {nights === 1 ? "noche" : "noches"}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-2">
                  <Label>Huéspedes</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "huésped" : "huéspedes"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Datos del Huésped</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" required />
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full font-bold text-lg py-6" disabled={!canSubmit}>
                  Confirmar Reserva — {total > 0 ? `${total}€` : "Selecciona fechas"}
                </Button>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Resumen</h3>
                  <img src={mainImage} alt={room.name} className="rounded-lg w-full h-40 object-cover mb-4" loading="lazy" />
                  <p className="font-semibold">{room.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">{room.roomType} · Hasta {room.capacity} {room.capacity === 1 ? "persona" : "personas"}</p>
                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{checkIn ? format(checkIn, "dd MMM yyyy", { locale: es }) : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{checkOut ? format(checkOut, "dd MMM yyyy", { locale: es }) : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Noches</span>
                      <span>{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio/noche</span>
                      <span>{room.pricePerNight}€</span>
                    </div>
                  </div>
                  <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">{total}€</span>
                  </div>
                </div>
              </div>
            </form>
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
                    <img
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