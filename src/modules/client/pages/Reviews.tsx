import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { useToast } from "@/modules/shared/hooks/use-toast";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import type { Review } from "@/modules/shared/types";

const INITIAL_REVIEWS: Review[] = [
  { id: "1", name: "María González", country: "España", rating: 5, text: "Una estancia maravillosa. El personal fue increíblemente amable y la habitación estaba impecable. ¡Volveremos seguro!", createdAt: "2025-12-15" },
  { id: "2", name: "Carlos Méndez", country: "México", rating: 4, text: "Excelente relación calidad-precio. La ubicación es perfecta para explorar la ciudad. El desayuno muy completo.", createdAt: "2025-11-20" },
  { id: "3", name: "Ana Rodríguez", country: "Argentina", rating: 5, text: "El mejor hostal en el que me he hospedado. Las habitaciones son cómodas y el ambiente es muy acogedor.", createdAt: "2025-10-08" },
  { id: "4", name: "Pierre Dupont", country: "Francia", rating: 5, text: "Magnifique! Un lugar encantador con un servicio excepcional. Las excursiones organizadas fueron fantásticas.", createdAt: "2025-09-25" },
  { id: "5", name: "Laura Fernández", country: "Colombia", rating: 4, text: "Muy buena experiencia. Habitación limpia, buena ubicación y el equipo siempre dispuesto a ayudar.", createdAt: "2025-08-12" },
  { id: "6", name: "James Wilson", country: "Estados Unidos", rating: 5, text: "Amazing place! The staff went above and beyond to make our stay special. Highly recommended!", createdAt: "2025-07-30" },
];

const Reviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !text.trim() || rating === 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa tu nombre, puntuación y comentario.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        name: name.trim(),
        country: country.trim() || "Sin especificar",
        rating,
        text: text.trim(),
        createdAt: new Date().toISOString().split("T")[0],
      };

      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setCountry("");
      setText("");
      setRating(0);
      setIsSubmitting(false);

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión ha sido publicada exitosamente.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Reseñas de <span className="text-primary">Huéspedes</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Comparte tu experiencia y ayuda a otros viajeros a conocer Villa D2.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(averageRating))
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{averageRating}</span>
              <span className="text-muted-foreground text-sm">
                ({reviews.length} reseñas)
              </span>
            </div>
          </div>

          {/* Form */}
          <Card className="mb-12">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Deja tu reseña</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">País</label>
                    <Input
                      placeholder="Tu país (opcional)"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Puntuación *</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoveredStar(starValue)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              starValue <= (hoveredStar || rating)
                                ? "text-primary fill-primary"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating}/5
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Comentario *</label>
                  <Textarea
                    placeholder="Cuéntanos sobre tu experiencia en Villa D2..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-semibold"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Enviando..." : "Publicar Reseña"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.map((r) => (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.country}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s < r.rating
                              ? "text-primary fill-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{r.text}"</p>
                  <p className="text-xs text-muted-foreground/60 mt-3">{r.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
