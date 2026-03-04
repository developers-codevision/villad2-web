import { useState } from "react";
import { Send, Star } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { useToast } from "@/modules/shared/hooks/use-toast";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { reviewsService } from "@/modules/shared/services";

const Reviews = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !content.trim() || stars === 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa tu nombre, puntuación y comentario.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await reviewsService.create({
        name: name.trim(),
        country: country.trim() || "Sin especificar",
        title: title.trim() || "Sin título",
        content: content.trim(),
        stars,
      });

      setName("");
      setCountry("");
      setTitle("");
      setContent("");
      setStars(0);

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión ha sido recibida, gracias por participar .",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "No pudimos procesar tu reseña. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">País</label>
                    <Input
                      placeholder="Tu país (opcional)"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    placeholder="Un breve título para tu reseña"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Comentario *</label>
                  <Textarea
                    placeholder="Cuéntanos sobre tu experiencia en Villa D2..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Puntuación *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStars(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        disabled={isSubmitting}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredStar || stars)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
