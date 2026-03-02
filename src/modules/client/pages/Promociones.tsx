import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { promotionsService, getMediaUrl } from "@/modules/shared/services";
import { Promotion, PromotionStatus } from "@/modules/shared/types/api.types";
import { parseServices, formatTimeToAmPm } from "@/modules/client/utils/promotionHelpers";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Promociones Especiales
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras ofertas exclusivas diseñadas para brindarte la mejor experiencia.
              Aprovecha estas promociones limitadas y vive momentos inolvidables en nuestro hostal.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando promociones...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
              <Tag size={48} className="mb-4 opacity-30" />
              <p className="font-medium">Sin promociones disponibles</p>
              <p className="text-sm mt-1">Vuelve más tarde para ver nuestras nuevas ofertas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => {
                // Parse services using the helper function
                const services = parseServices(promo.services);

                return (
                  <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    {promo.photo && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={getMediaUrl(promo.photo)}
                          alt={promo.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{promo.title}</CardTitle>
                      {promo.description && (
                        <p className="text-sm text-muted-foreground mt-2">{promo.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {promo.minPeople !== undefined && promo.minPeople > 0 && (
                          <div>
                            <p className="text-muted-foreground">Mín. personas</p>
                            <p className="font-semibold">{promo.minPeople}</p>
                          </div>
                        )}
                        {promo.maxPeople !== undefined && promo.maxPeople > 0 && (
                          <div>
                            <p className="text-muted-foreground">Máx. personas</p>
                            <p className="font-semibold">{promo.maxPeople}</p>
                          </div>
                        )}
                        {promo.time && (
                          <div>
                            <p className="text-muted-foreground">Duración</p>
                            <p className="font-semibold">{formatTimeToAmPm(promo.time) || promo.time}</p>
                          </div>
                        )}
                      </div>

                      {(promo.checkInTime || promo.checkOutTime) && (
                        <div className="border-t pt-3 grid grid-cols-2 gap-3 text-sm">
                          {promo.checkInTime && (
                            <div>
                              <p className="text-muted-foreground">Entrada</p>
                              <p className="font-semibold">{formatTimeToAmPm(promo.checkInTime) || promo.checkInTime}</p>
                            </div>
                          )}
                          {promo.checkOutTime && (
                            <div>
                              <p className="text-muted-foreground">Salida</p>
                              <p className="font-semibold">{formatTimeToAmPm(promo.checkOutTime) || promo.checkOutTime}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {services && services.length > 0 && (
                        <div className="border-t pt-3 mt-auto">
                          <p className="text-sm font-medium mb-2">Servicios incluidos</p>
                          <ul className="space-y-1">
                            {services.map((service, idx) => {
                              // Clean up the service string if it contains JSON characters
                              const cleanService = typeof service === 'string'
                                ? service.replace(/[\[\]"]/g, '').trim()
                                : service;
                              return (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  {cleanService}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
