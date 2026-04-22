import { Link } from "react-router-dom";
import {useEffect, useState} from 'react'
import { Phone, Mail, MapPin, MessageCircle, Star, FileText, ArrowRight } from "lucide-react";
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
import DescriptionSection from "@/modules/client/components/DescriptionSection";
import TerraceBarSection from "@/modules/client/components/TerraceBarSection";
import ReceptionSection from "@/modules/client/components/ReceptionSection";
import ExchangeRateSection from "@/modules/client/components/ExchangeRateSection";
import { useLanguage } from "@/modules/client/contexts";
import { parseBilingualText } from "@/modules/client/utils/bilingualHelpers";

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { t, language } = useLanguage();

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

  // Inject JSON-LD for reviews & aggregate rating to improve SEO
  useEffect(() => {
    if (loadingReviews) return;

    try {
      const reviewCount = reviews.length;

      const ratingValue =
        reviewCount > 0
          ? (reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / reviewCount).toFixed(1)
          : undefined;

      const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: HOSTAL.name,
        url:
          typeof window !== "undefined" && window.location && window.location.origin
            ? window.location.origin
            : undefined,
        aggregateRating:
          reviewCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: ratingValue,
                reviewCount: reviewCount,
              }
            : undefined,
        review: reviews.map((r) => {
          const reviewObj: any = {
            "@type": "Review",
            author: r.name ? { "@type": "Person", name: r.name } : undefined,
            reviewBody: r.content,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.stars ?? 0),
              bestRating: "5",
              worstRating: "1",
            },
          };

          if ((r as any).createdAt) reviewObj.datePublished = (r as any).createdAt;
          if (r.title) reviewObj.name = r.title;

          // Remove undefined fields per review
          Object.keys(reviewObj).forEach((k) => {
            if (reviewObj[k] === undefined || reviewObj[k] === null) delete reviewObj[k];
          });

          return reviewObj;
        }),
      };

      // Clean top-level undefineds
      const cleaned: any = {};
      Object.entries(jsonLd).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        cleaned[k] = v;
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(cleaned);
      document.head.appendChild(script);

      return () => {
        if (script && script.parentNode) script.parentNode.removeChild(script);
      };
    } catch (err) {
      // Don't break the UI if JSON-LD generation fails
      // eslint-disable-next-line no-console
      console.warn("Error building JSON-LD for reviews", err);
    }
    // stringify reviews to ensure effect runs when review contents change
  }, [loadingReviews, JSON.stringify(reviews)]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      {/* MOBILE hero */}
      <div className="desk:hidden flex flex-col pt-16">
        {/* Imagen con título superpuesto */}
        <div className="relative w-full aspect-video">
          <img
            src="/Foto-portada-no1-editada-scaled.webp"
            alt="Hostal Villa D2"
            width={1920}
            height={1080}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Título sobre la imagen */}
          <div className="absolute inset-0 flex flex-col items-start p-4 pt-3">
            <h1 className="text-2xl font-extrabold leading-tight text-white drop-shadow-2xl">
              {t("home.heroTitle")}{" "}
              <span className="text-primary drop-shadow-2xl">{HOSTAL.name}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* DESK hero */}
      <section className="relative min-h-[100vh] hidden desk:flex items-center">
        <img
          src="/Foto-portada-no1-editada-scaled.webp"
          alt="Hostal Villa D2"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 mt-10 h-[calc(100%-2.5rem)] w-full object-cover object-center"
        />

        {/* Título - Esquina superior izquierda */}
        <div className="absolute top-24 left-8 z-10 flex flex-col ">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl whitespace-nowrap">
            {t("home.heroTitle")}{" "}
            <span className="text-primary drop-shadow-2xl">{HOSTAL.name}</span>
          </h1>
        </div>

        {/* Logo - Esquina superior derecha (sin fondo) */}
        <div className="absolute top-24 right-8 z-10">
          <img
            src={logo}
            alt="Villa D2"
            width={224}
            height={112}
            loading="eager"
            decoding="async"
            className="h-24 lg:h-28 w-auto drop-shadow-2xl"
          />
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

      <DescriptionSection />

      {/* Botón de reservar (movido aquí desde el hero) */}
      <div className="flex justify-center pb-12 bg-background">
        <Link to="/reservas">
          <Button size="lg" className="text-lg px-10 py-6 font-bold shadow-xl">
            {t("home.bookNow")}
          </Button>
        </Link>
      </div>

      {/* Reviews */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-primary/40" />
            <Star className="h-5 w-5 text-primary fill-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {t("home.reviewsTitle")}
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t("home.reviewsSubtitle")}
          </p>
          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">{t("home.loadingReviews")}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("home.noReviews")}</p>
            </div>
          ) : (
            <Carousel className="w-full mx-auto">
              <CarouselContent className="-ml-4">
                {reviews.map((review) => {
                  return (
                    <CarouselItem key={review.id} className="pl-4 basis-2/3 md:basis-1/3 lg:basis-1/3">
                      <div className="group relative rounded-2xl border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[28rem] md:h-80 overflow-hidden">
                        {/* Decorative quote */}
                        <div className="absolute top-4 right-4 text-6xl font-serif text-primary/10 leading-none select-none pointer-events-none group-hover:text-primary/20 transition-colors">
                          "
                        </div>

                        <div className="relative p-4 flex flex-col h-full z-10">
                          {/* TOP: Avatar + name/country + stars */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {review.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm truncate">{review.name}</p>
                              {review.country && <p className="text-xs text-muted-foreground truncate">{review.country}</p>}
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star
                                  key={s}
                                  className={`h-4 w-4 ${
                                    s < review.stars
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* MIDDLE: title + content */}
                          {review.title && (
                            <p className="font-semibold text-xs mb-2">{review.title}</p>
                          )}
                          <p className="text-xs leading-relaxed text-foreground/90 mb-4 line-clamp-10 text-left">
                            "{review.content}"
                          </p>

                          {/* BOTTOM: hostal response */}
                          {review.response && (
                            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 mt-auto">
                              <p className="text-xs font-semibold text-primary mb-1">{t("home.hostalResponse")}</p>
                              <p className="text-xs text-foreground/80 line-clamp-3">{review.response}</p>
                            </div>
                          )}
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

      <section className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-primary/40" />
            <FileText className="h-5 w-5 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
<h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
    {language === 'es' ? 'Nuestro ' : 'Our '}<span style={{ color: '#00c3ff' }}>{language === 'es' ? 'Blog' : 'Blog'}</span>
  </h2>
  <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
    {t('blog.subtitle')}
  </p>
  <div className="text-center">
    <Link to="/blog">
      <Button size="lg" className="gap-2">
        {language === 'es' ? 'Ver artículos' : 'View articles'}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  </div>
        </div>
      </section>

      <TerraceBarSection />
      <ReceptionSection />
      {/*<ExchangeRateSection />*/}

      {/* Services */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {t("home.servicesTitle")}
          </h2>
<p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t("home.servicesSubtitle")}
          </p>

          <div className="text-center">
            <Link to="/servicios">
              <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t("home.viewAllServices")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact + Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("home.contactTitle")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#00c3ff]/10 rounded-full p-3"><Phone className="text-[#00c3ff]" /></div>
                <div>
                  <p className="font-semibold">{t("home.phones")}</p>
                  <p className="text-muted-foreground">{HOSTAL.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#00c3ff]/10 rounded-full p-3"><Mail className="text-[#00c3ff]" /></div>
                <div>
                  <p className="font-semibold">{t("home.email")}</p>
                  <p className="text-muted-foreground">{HOSTAL.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#00c3ff]/10 rounded-full p-3"><MessageCircle className="text-[#00c3ff]" /></div>
                <div>
                  <p className="font-semibold">{t("home.whatsapp")}</p>
                  <p className="text-muted-foreground">{HOSTAL.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#00c3ff]/10 rounded-full p-3"><MapPin className="text-[#00c3ff]" /></div>
                <div>
                  <p className="font-semibold">{t("home.address")}</p>
                  <p className="text-muted-foreground">{HOSTAL.address}</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg h-[350px]">
              <iframe
                src={HOSTAL.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("home.mapTitle")}
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
