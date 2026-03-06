import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { promotionsService } from "@/modules/shared/services";
import { Promotion, PromotionStatus } from "@/modules/shared/types/api.types";
import { PromotionHeroCard, PromotionGlassCard, PromotionHorizontalCard } from "@/modules/client/components/promotions";

export default function Promociones() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await promotionsService.getAll(
          PromotionStatus.ACTIVE,
          1,
          100
        );
        setPromotions(response.promotions);
      } catch (error) {
        console.error("Error loading promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  /**
   * Renders promotions in a varied, magazine-style layout:
   * - 1st promotion: full-width hero card
   * - 2nd & 3rd: glass cards side by side
   * - 4th: horizontal card (left image)
   * - 5th & 6th: glass cards side by side
   * - 7th: horizontal card (right image / reversed)
   * ...and repeats the pattern
   */
  const renderPromotions = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < promotions.length) {
      // Hero card for the first item
      if (i === 0) {
        elements.push(
          <PromotionHeroCard key={promotions[i].id} promotion={promotions[i]} />
        );
        i++;
        continue;
      }

      // Pair of glass cards
      const glassStart = i;
      const glassItems = promotions.slice(glassStart, glassStart + 2);
      if (glassItems.length > 0) {
        elements.push(
          <div key={`glass-${glassStart}`} className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {glassItems.map((promo) => (
              <PromotionGlassCard key={promo.id} promotion={promo} />
            ))}
          </div>
        );
        i += glassItems.length;
      }

      // Horizontal card (alternating direction)
      if (i < promotions.length) {
        const isReversed = Math.floor(i / 3) % 2 === 1;
        elements.push(
          <PromotionHorizontalCard
            key={promotions[i].id}
            promotion={promotions[i]}
            reverse={isReversed}
          />
        );
        i++;
      }
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Ofertas exclusivas
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Promociones Especiales
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Descubre nuestras ofertas diseñadas para brindarte la mejor experiencia.
              Aprovecha estas promociones limitadas y vive momentos inolvidables.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`${i === 0 ? 'col-span-full h-[400px]' : 'h-[350px]'} rounded-2xl bg-muted animate-pulse`}
                />
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-muted-foreground">
              <Tag size={56} className="mb-5 opacity-20" />
              <p className="font-semibold text-lg">Sin promociones disponibles</p>
              <p className="text-sm mt-2">Vuelve más tarde para ver nuestras nuevas ofertas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {renderPromotions()}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
