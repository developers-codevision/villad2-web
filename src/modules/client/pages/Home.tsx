import { Link } from "react-router-dom";
import {useEffect, useState} from 'react'
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
import { HOSTAL } from "@/modules/shared/data/hostal";
import { reviewsService } from "@/modules/shared/services";
import { Review, ReviewStatus } from "@/modules/shared/types/api.types";
import logo from "@/assets/logo.png";
import TerraceBarSection from "@/modules/client/components/TerraceBarSection";
import ReceptionSection from "@/modules/client/components/ReceptionSection";
import ExchangeRateSection from "@/modules/client/components/ExchangeRateSection";

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Cargar reseñas aprobadas desde la API
  useEffect(() => {
    const loadApprovedReviews = async () => {
      try {
        const response = await reviewsService.getAll(ReviewStatus.ACTIVE, 1, 100);
        setReviews(response.reviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
        // Fallback a reseñas por defecto si hay error
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadApprovedReviews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      {/* MOBILE hero */}
      <div className="desk:hidden flex flex-col pt-16">
        {/* Imagen con título superpuesto */}
        <div className="relative w-full">
          <img
            src="/Foto-portada-no1-editada-scaled.jpg"
            alt="Hostal Villa D2"
            className="w-full object-cover object-center"
            style={{ height: "55vw", minHeight: "220px", maxHeight: "420px" }}
          />
          {/* Título sobre la imagen */}
          <div className="absolute inset-0 flex items-start p-4 pt-3">
            <h1 className="text-2xl font-extrabold leading-tight text-white drop-shadow-2xl">
              Hostal Boutique{" "}
              <span className="text-primary drop-shadow-2xl">{HOSTAL.name}</span>
            </h1>
          </div>
        </div>
        {/* Botón debajo de la imagen */}
        <div className="flex justify-center py-5 bg-background">
          <Link to="/reservas">
            <Button size="lg" className="text-lg px-10 py-6 font-bold shadow-2xl">
              Reservar Ahora
            </Button>
          </Link>
        </div>
      </div>

      {/* DESK hero */}
      <section className="relative min-h-[100vh] hidden desk:flex items-center">
        {/* Imagen de fondo completa sin overlay */}
        <div
          className="absolute inset-0 bg-center mt-10"
          style={{
            backgroundImage: "url('/Foto-portada-no1-editada-scaled.jpg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        {/* Título - Esquina superior izquierda */}
        <div className="absolute top-24 left-8 z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Hostal Boutique{" "}
            <span className="text-primary drop-shadow-2xl">{HOSTAL.name}</span>
          </h1>
        </div>

        {/* Logo - Esquina superior derecha (sin fondo) */}
        <div className="absolute top-24 right-8 z-10">
          <img src={logo} alt="Villa D2" className="h-24 lg:h-28 w-auto drop-shadow-2xl" />
        </div>

        {/* Descripción */}
        <div className="absolute bottom-12 right-8 z-10 max-w-xl">
          <div className="bg-accent/40 backdrop-blur-sm border-l-4 border-primary px-6 py-4 rounded-r-lg">
            <p className="text-lg lg:text-xl">
              {HOSTAL.tagline} — {HOSTAL.description}
            </p>
          </div>
        </div>

        {/* Botón - Centro inferior */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <Link to="/reservas">
            <Button size="lg" className="text-lg px-10 py-6 font-bold shadow-2xl">
              Reservar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Rooms preview
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
      </section>*/}

      <TerraceBarSection />
      <ReceptionSection />
      <ExchangeRateSection />

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
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-primary/40" />
            <Star className="h-5 w-5 text-primary fill-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Lo que dicen nuestros <span className="text-primary">Huéspedes</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Experiencias reales de quienes ya nos visitaron.
          </p>
          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Cargando reseñas...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay reseñas aprobadas aún. ¡Sé el primero en dejar una!</p>
            </div>
          ) : (
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent className="-ml-4">
                {reviews.map((review, index) => {
                  const accentStyles = [
                    "from-primary/10 to-primary/5 border-l-primary",
                    "from-secondary/20 to-secondary/5 border-l-secondary",
                    "from-accent to-accent/40 border-l-primary/60",
                  ];
                  const style = accentStyles[index % accentStyles.length];

                  return (
                    <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className={`group relative rounded-2xl border-l-4 bg-gradient-to-br ${style} backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden`}>
                        {/* Decorative quote */}
                        <div className="absolute top-4 right-4 text-6xl font-serif text-primary/10 leading-none select-none pointer-events-none group-hover:text-primary/20 transition-colors">
                          "
                        </div>

                        <div className="relative p-6 flex flex-col h-full z-10">
                          {/* Stars - top */}
                          <div className="flex items-center gap-0.5 mb-4">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                                  s < review.stars
                                    ? "text-primary fill-primary drop-shadow-sm"
                                    : "text-muted-foreground/20"
                                }`}
                                style={{ transitionDelay: `${s * 40}ms` }}
                              />
                            ))}
                            <span className="ml-2 text-xs font-medium text-muted-foreground">{review.stars}/5</span>
                          </div>

                          {/* Content */}
                          <p className="text-sm leading-relaxed text-foreground/90 flex-1 mb-5 line-clamp-4">
                            "{review.content}"
                          </p>

                          {/* Response */}
                          {review.response && (
                            <div className="bg-primary/5 rounded-lg p-3 mb-4 border border-primary/10">
                              <p className="text-xs font-semibold text-primary mb-1">💬 Respuesta del hostal</p>
                              <p className="text-xs text-foreground/80 line-clamp-2">{review.response}</p>
                            </div>
                          )}

                          {/* Author */}
                          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {review.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{review.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{review.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="border-primary/30 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="border-primary/30 hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          )}
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
