import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";

const ExchangeRateSection = () => {
  return (
    <section className="py-20 px-4 bg-accent/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Tipos de <span className="text-primary">Cambio</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Consulta los valores actuales del mercado cambiario en Cuba. Accede a CADECA para ver las cotizaciones en tiempo real y obtener la mejor tasa de cambio para tu conversión de divisas.
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
              Ver Tipos de Cambio en CADECA
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExchangeRateSection;

