import * as React from "react";
import { useLanguage } from "@/modules/client/contexts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/shared/components/ui/accordion";
import { interestPlacesData } from "@/modules/shared/data/interestPlaces";
import { useEffect } from "react";

const categories = [
  { key: "museos", icon: "🏛️" },
  { key: "culturales", icon: "🏛️" },
  { key: "vidaNocturna", icon: "🎵" },
  { key: "paseos", icon: "🌊" },
  { key: "gastronomia", icon: "🍽️" },
  { key: "excursiones", icon: "🏛️" },
];

const categoryTitles = {
  museos: {
    es: "Museos",
    en: "Museums",
  },
  culturales: {
    es: "Culturales",
    en: "Cultural",
  },
  vidaNocturna: {
    es: "Música, Cabarets y Vida Nocturna",
    en: "Music, Cabarets and Nightlife",
  },
  paseos: {
    es: "Paseos y Espacios Abiertos",
    en: "Walks and Open Spaces",
  },
  gastronomia: {
    es: "Gastronomía y Ocio",
    en: "Gastronomy and Leisure",
  },
  excursiones: {
    es: "Excursiones",
    en: "Excursions",
  },
};

export default function InterestPlacesList() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  // Schema para SEO
  useEffect(() => {
    const allPlaces = [
      ...interestPlacesData.museos,
      ...interestPlacesData.culturales,
      ...interestPlacesData.vidaNocturna,
      ...interestPlacesData.paseos,
      ...interestPlacesData.gastronomia,
      ...interestPlacesData.excursiones,
    ];

    const placesSchema = {
      "@context": "https://schema.org",
      "@type": "TouristInformationCenter",
      "name": isEnglish ? "Places of Interest near Villa D2" : "Lugares de Interés cerca de Villa D2",
      "description": isEnglish
        ? "Discover museums, theaters, restaurants and attractions near Villa D2 in Vedado, Havana"
        : "Descubre museos, teatros, restaurantes y atracciones cerca de Villa D2 en el Vedado, La Habana",
      "url": "https://villad2.com/lugares-interes",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle 37 #14 e/Paseo y Calle 2",
        "addressLocality": "Vedado",
        "addressRegion": "La Habana",
        "addressCountry": "CU"
      },
      "nearbyLocation": allPlaces.slice(0, 20).map(place => ({
        "@type": "TouristAttraction",
        "name": place.name,
        "description": isEnglish && place.descriptionEn ? place.descriptionEn : place.description,
        "url": "https://villad2.com/lugares-interes"
      }))
    };

    let script = document.getElementById('places-schema') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'places-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(placesSchema);
  }, [language]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {isEnglish ? "Tourist Places of Interest" : "Lugares de Interés Turístico"}
        </h2>
        <p className="text-muted-foreground text-left max-w-xl mx-auto">
          {isEnglish
            ? "Discover the best museums, theaters, cabarets and restaurants in Vedado, all a few minutes from Villa D2 Boutique Hostel, you have walking access to the most emblematic places of Havana. Presentation of a selection of tourist, cultural and recreational sites near the Villa. At reception we can organize other transfers, tickets and various excursions, join them by WhatsApp or consult us at check-in."
            : "Descubre los mejores museos, teatros, cabarets y restaurantes del Vedado de La Habana, todos a pocos minutos del Hostal Boutique Villa D2, tienes acceso a pie a de los lugares más emblemáticos de La Habana. Presentación de una selección de sitios turísticos, culturales y recreativos cercanos a la Villa. En recepción podemos organizarles otros traslados, entradas y excursiones diversas, únete a ellos por WhatsApp o consúltanos al hacer el check-in."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Accordion type="single" collapsible key={category.key}>
            <AccordionItem
              value={category.key}
              className="bg-card border border-border rounded-lg px-4"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>
                    {categoryTitles[category.key as keyof typeof categoryTitles][
                      isEnglish ? "en" : "es"
                    ]}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {interestPlacesData[category.key as keyof typeof interestPlacesData].map(
                    (place: {
                      name: string;
                      description: string;
                      descriptionEn?: string;
                    }) => (
                      <div
                        key={place.name}
                        className="bg-muted/30 rounded-lg p-4 border border-border/50"
                      >
                        <h4 className="font-semibold text-base mb-2 text-foreground">
                          {place.name}
                        </h4>
                        <p className="text-muted-foreground text-sm text-left leading-relaxed">
                          {isEnglish && place.descriptionEn
                            ? place.descriptionEn
                            : place.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}