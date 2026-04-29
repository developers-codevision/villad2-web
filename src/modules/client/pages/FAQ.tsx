import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { FAQSection } from "@/modules/client/components";
import { useEffect } from "react";
import { useLanguage } from "@/modules/client/contexts";

export default function FAQ() {
  const { language, t } = useLanguage();

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": language === "es" ? "¿Cuál es el horario de check-in y check-out?" : "What are the check-in and check-out times?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": language === "es" 
              ? "El check-in está disponible a partir de las 4:00 PM, el check-out debe realizarse antes de las 12:00 PM."
              : "Check-in is available from 4:00 PM, check-out must be done before 12:00 PM."
          }
        },
        {
          "@type": "Question",
          "name": language === "es" ? "¿Puedo cancelar o modificar mi reserva?" : "Can I cancel or modify my reservation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": language === "es"
              ? "Sí puedes modificar o cancelar la reserva a través de tu cuenta."
              : "Yes you can modify or cancel the reservation through your account."
          }
        },
        {
          "@type": "Question",
          "name": language === "es" ? "¿Hay WiFi disponible en la habitación?" : "Is WiFi available in the room?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": language === "es"
              ? "Sí, contamos con WiFi de alta velocidad en todos los puntos de la Villa."
              : "Yes, we have high-speed WiFi throughout the Villa."
          }
        },
        {
          "@type": "Question",
          "name": language === "es" ? "¿Se permiten mascotas en Villa D2?" : "Are pets allowed at Villa D2?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": language === "es"
              ? "No se permiten mascotas ni animales guías en la instalación."
              : "Pets and guide animals are not allowed on the premises."
          }
        },
        {
          "@type": "Question",
          "name": language === "es" ? "¿Está incluido el desayuno en la reserva?" : "Is breakfast included in the reservation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": language === "es"
              ? "No está incluido en el precio de la habitación, lo puedes reservar durante el check-in."
              : "Breakfast is not included in the room price, you can book it during check-in."
          }
        }
      ]
    };

    let script = document.getElementById('faq-schema') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

