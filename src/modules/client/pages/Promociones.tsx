import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { promotionsService } from "@/modules/shared/services";
import { Promotion, PromotionStatus } from "@/modules/shared/types/api.types";
import { PromotionHeroCard } from "@/modules/client/components/promotions";
import { useLanguage } from "@/modules/client/contexts";

export default function Promociones() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {t("promo.exclusive")}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {t("promo.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              {t("promo.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[460px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-muted-foreground">
              <Tag size={56} className="mb-5 opacity-20" />
              <p className="font-semibold text-lg">{t("promo.none")}</p>
              <p className="text-sm mt-2">{t("promo.noneDesc")}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {promotions.map((promo) => (
                <PromotionHeroCard key={promo.id} promotion={promo} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
