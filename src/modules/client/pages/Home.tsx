import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Star } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/modules/shared/components/ui/carousel";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import RoomCard from "@/modules/client/components/RoomCard";
import { HOSTAL, SERVICES_BASIC, SERVICES_TOURIST, SERVICES_SECURITY, SERVICES_INCLUDED, SERVICES_ADDITIONAL } from "@/modules/shared/data/hostal";
import { useRooms } from "@/modules/client/hooks/useRooms";
import logo from "@/assets/logo.png";

const Index = () => {
  const { rooms, loading } = useRooms();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Imagen de fondo completa sin overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/Foto-portada-no1-editada-scaled.jpg')",
          }}
        />

        {/* Título - Esquina superior izquierda */}
        <div className="absolute top-20 left-4 md:top-24 md:left-8 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Hostal Boutique{" "}
            <span className="text-primary drop-shadow-2xl">{HOSTAL.name}</span>
          </h1>
        </div>

        {/* Logo - Esquina superior derecha (sin fondo) */}
        <div className="absolute top-20 right-4 md:top-24 md:right-8 z-10">
          <img src={logo} alt="Villa D2" className="h-16 md:h-24 lg:h-28 w-auto drop-shadow-2xl" />
        </div>

        {/* Descripción - Esquina inferior izquierda */}
        <div className="absolute bottom-8 md:bottom-12 left-4 md:left-8 z-10 max-w-md md:max-w-xl">
          <div className="bg-accent/40 backdrop-blur-sm border-l-4 border-primary px-6 py-4 rounded-r-lg">
            <p className="text-base md:text-lg lg:text-xl">
              {HOSTAL.tagline} — {HOSTAL.description}
            </p>
          </div>
        </div>

        {/* Botón - Centro inferior */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10">
          <Link to="/reservas">
            <Button size="lg" className="text-lg px-10 py-6 font-bold shadow-2xl">
              Reservar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Rooms preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestras <span className="text-primary">Habitaciones</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Desde acogedoras individuales hasta suites premium, tenemos la opción perfecta para ti.
          </p>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Cargando habitaciones...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.slice(0, 6).map((room) => (
                  <RoomCard key={room.id} room={room} compact />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/habitaciones">
                  <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Ver Todas las Habitaciones
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Desde seguridad 24/7 hasta servicios premium, tenemos todo lo que necesitas para una estancia perfecta.
          </p>

          <div className="text-center">
            <Link to="/servicios">
              <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Lo que dicen nuestros <span className="text-primary">Huéspedes</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Experiencias reales de quienes ya nos visitaron.
          </p>
          <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-4">
              {[
                { name: "María González", country: "España", rating: 5, text: "Una estancia maravillosa. El personal fue increíblemente amable y la habitación estaba impecable. ¡Volveremos seguro!" },
                { name: "Carlos Méndez", country: "México", rating: 4, text: "Excelente relación calidad-precio. La ubicación es perfecta para explorar la ciudad. El desayuno muy completo." },
                { name: "Ana Rodríguez", country: "Argentina", rating: 5, text: "El mejor hostal en el que me he hospedado. Las habitaciones son cómodas y el ambiente es muy acogedor." },
                { name: "Pierre Dupont", country: "Francia", rating: 5, text: "Magnifique! Un lugar encantador con un servicio excepcional. Las excursiones organizadas fueron fantásticas." },
                { name: "Laura Fernández", country: "Colombia", rating: 4, text: "Muy buena experiencia. Habitación limpia, buena ubicación y el equipo siempre dispuesto a ayudar." },
                { name: "James Wilson", country: "Estados Unidos", rating: 5, text: "Amazing place! The staff went above and beyond to make our stay special. Highly recommended!" },
              ].map((r, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={`h-4 w-4 ${s < r.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic flex-1 mb-4">"{r.text}"</p>
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.country}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Contact + Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-primary">Contacto</span> y Ubicación
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><Phone className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Teléfonos</p>
                  <p className="text-muted-foreground">{HOSTAL.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><Mail className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">{HOSTAL.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><MessageCircle className="text-primary" /></div>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-muted-foreground">{HOSTAL.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><MapPin className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Dirección</p>
                  <p className="text-muted-foreground">{HOSTAL.address}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-[350px]">
              <iframe
                src={HOSTAL.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del hostal"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
