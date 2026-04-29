import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { SERVICES_SECURITY, SERVICES_INCLUDED, SERVICES_ADDITIONAL } from "@/modules/shared/data/hostal";
import { useLanguage } from "@/modules/client/contexts";
import { parseBilingualText } from "@/modules/client/utils/bilingualHelpers";
import { useEffect } from "react";

export default function Services() {
  const { language, t } = useLanguage();

  // Schema para SEO
  useEffect(() => {
    const services = [
      ...SERVICES_SECURITY.map(s => ({ ...s, category: "security" })),
      ...SERVICES_INCLUDED.map(s => ({ ...s, category: "included" })),
      ...SERVICES_ADDITIONAL.map(s => ({ ...s, category: "additional" }))
    ];

    const servicesSchema = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Hostal Boutique Villa D2",
      "description": language === "es" 
        ? "Servicios disponibles en Villa D2" 
        : "Services available at Villa D2",
      "url": "https://villad2.com/servicios",
      "amenityFeature": services.map(s => ({
        "@type": "LocationFeatureSpecification",
        "name": parseBilingualText(s.name, language),
        "description": parseBilingualText(s.description, language)?.substring(0, 200),
        "value": true
      }))
    };

    let script = document.getElementById('services-schema') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'services-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(servicesSchema);
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {t("services.title")}
          </h1>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            {t("services.subtitle")}
          </p>

          {/* Basic */}
          <h2 className="text-2xl font-bold mb-6">{t("services.security")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {SERVICES_SECURITY.map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="bg-[#00c3ff]/10 rounded-full p-3 shrink-0">
                  <s.icon size={24} className="text-[#00c3ff]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{parseBilingualText(s.name, language)}</h3>
                  <p className="text-muted-foreground text-sm">{parseBilingualText(s.description, language)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Included */}
          <h2 className="text-2xl font-bold mb-6">{t("services.included")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {SERVICES_INCLUDED.map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="bg-[#00c3ff]/10 rounded-full p-3 shrink-0">
                  <s.icon size={24} className="text-[#00c3ff]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{parseBilingualText(s.name, language)}</h3>
                  <p className="text-muted-foreground text-sm">{parseBilingualText(s.description, language)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional */}
          <h2 className="text-2xl font-bold mb-6">{t("services.additional")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_ADDITIONAL.map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="bg-[#00c3ff]/10 rounded-full p-3 shrink-0">
                  <s.icon size={24} className="text-[#00c3ff]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{parseBilingualText(s.name, language)}</h3>
                  <p className="text-muted-foreground text-sm">{parseBilingualText(s.description, language)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
