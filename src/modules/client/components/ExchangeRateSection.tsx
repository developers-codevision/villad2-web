import { DollarSign } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { useLanguage } from '../contexts';

const ExchangeRateSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-accent/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("exchange.title")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {t("exchange.description")}
        </p>
        <div className="flex justify-center">
          <a
            href="https://www.cadeca.cu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button size="lg" className="text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-shadow">
              <DollarSign className="mr-2 h-5 w-5" />
              {t("exchange.button")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExchangeRateSection;
