import * as React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { interestPlaces } from "@/modules/shared/data/interestPlaces";
import { useLanguage } from "@/modules/client/contexts";
import { parseBilingualText } from "@/modules/client/utils/bilingualHelpers";

export default function InterestPlacesList() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {t("places.title")}
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto">
          {t("places.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interestPlaces.map((place, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="bg-primary/10 rounded-full p-3 shrink-0 mt-0.5">
              <MapPin size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base">{parseBilingualText(place.name, language)}</h3>
                {place.url && (
                  <ExternalLink size={16} className="text-primary flex-shrink-0 mt-0.5" />
                )}
              </div>
              {place.url ? (
                <a
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-2 inline-flex items-center gap-1"
                >
                  {t("places.visitSite")}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">
                  {t("places.checkAvailability")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
