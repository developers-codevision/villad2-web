import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, t } = useLanguage();

  const faqs: FAQItem[] = [
    {
      question: "¿Cuál es el horario de check-in y check-out? / What are the check-in and check-out times?",
      answer: "El check-in está disponible a partir de las 3:00 PM y el check-out debe realizarse antes de las 11:00 AM. Podemos ofrecer Early check-in  o Late check-out  sujeto a disponibilidad y con un costo adicional. Por favor solicítalo al momento de la reserva. / Check-in is available from 3:00 PM and check-out must be done before 11:00 AM. We can offer Early check-in or Late check-out subject to availability and with an additional cost. Please request it at the time of booking."
    },
    {
      question: "¿Puedo cancelar o modificar mi reserva? / Can I cancel or modify my reservation?",
      answer: "Sí, puedes modificar tu reserva en cualquier momento a través de tu cuenta. Para cancelaciones, consulta nuestras políticas que dependen de cuándo canceles respecto a tu fecha de check-in. Cancela con al menos 14 días de anticipación para obtener un reembolso completo. / Yes, you can modify your reservation at any time through your account. For cancellations, check our policies that depend on when you cancel relative to your check-in date. Cancel at least 14 days in advance to get a full refund."
    },
    {
      question: "¿Hay WiFi disponible en la habitación? / Is WiFi available in the room?",
      answer: "Sí, contamos con WiFi de alta velocidad en toda la propiedad, incluyendo todas las habitaciones, áreas comunes y el restaurante. La contraseña se proporcionará al check-in y también se enviará por email con tu confirmación. / Yes, we have high-speed WiFi throughout the property, including all rooms, common areas and the restaurant. The password will be provided at check-in and will also be sent by email with your confirmation."
    },
    {
      question: "¿Se permiten mascotas en Villa D2? / Are pets allowed at Villa D2?",
      answer: "Sí, aceptamos mascotas pequeñas con un cargo adicional de $20 USD por noche. Las mascotas deben estar debidamente vacunadas y el huésped es responsable de cualquier daño que causen. Por favor notifícanos al momento de la reserva. / Yes, we accept small pets with an additional charge of $20 USD per night. Pets must be properly vaccinated and the guest is responsible for any damage they cause. Please notify us at the time of booking."
    },
    {
      question: "¿Está incluido el desayuno en la reserva? / Is breakfast included in the reservation?",
      answer: "Sí, el desayuno continental está incluido en todas nuestras tarifas de habitación. Se sirve de 7:00 AM a 11:00 AM en nuestro comedor. Si tienes necesidades dietéticas especiales, avísanos con anticipación para poder acomodarte. / Yes, continental breakfast is included in all our room rates. It is served from 7:00 AM to 11:00 AM in our dining room. If you have special dietary needs, let us know in advance so we can accommodate you."
    },
    {
      question: "¿Hay estacionamiento disponible? / Is parking available?",
      answer: "Sí, contamos con estacionamiento gratuito para todos nuestros huéspedes. Es seguro y vigilado 24/7. No hay cargo adicional por estacionamiento y está disponible por orden de llegada en el caso de estancias prolongadas. / Yes, we have free parking for all our guests. It is safe and monitored 24/7. There is no additional charge for parking and it is available on a first-come, first-served basis for extended stays."
    },
    {
      question: "¿Qué métodos de pago aceptan? / What payment methods do you accept?",
      answer: "Aceptamos transferencias bancarias a través de Zelle (para huéspedes estadounidenses), Bizum (para huéspedes españoles) y pagos con tarjeta de crédito a través de Stripe. Todos los pagos son seguros y cifrados. / We accept bank transfers through Zelle (for US guests), Bizum (for Spanish guests) and credit card payments through Stripe. All payments are secure and encrypted."
    },
    {
      question: "¿Hay visitas guiadas disponibles? / Are guided tours available?",
      answer: "Sí, nuestro equipo de recepción puede ayudarte a organizar visitas guiadas a sitios de interés turístico, museos y centros recreativos locales. Contamos con coordinaciones especiales para trasladarte. Pregunta en recepción al llegar. / Yes, our reception team can help you organize guided tours to tourist sites of interest, museums and local recreational centers. We have special arrangements to transport you. Ask at reception upon arrival."
    },
    {
      question: "¿Cuál es la política de ruido en la propiedad? / What is the noise policy on the property?",
      answer: "Mantenemos un ambiente tranquilo para todos nuestros huéspedes. El ruido excesivo debe minimizarse después de las 10:00 PM. Si experimentas problemas de ruido, contacta inmediatamente a nuestro personal de seguridad disponible 24/7. / We maintain a quiet environment for all our guests. Excessive noise should be minimized after 10:00 PM. If you experience noise problems, contact our security staff immediately, available 24/7."
    },
    {
      question: "¿Necesito pagar depósito de seguridad? / Do I need to pay a security deposit?",
      answer: "El monto de la reserva actúa como depósito. No hay cargo de depósito adicional. Si no hay daños durante tu estancia, se procesa un reembolso completo después del check-out según nuestras políticas de pago. / The reservation amount acts as a deposit. There is no additional deposit charge. If there is no damage during your stay, a full refund is processed after check-out according to our payment policies."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <h3 className="text-left font-semibold text-base pr-4">{parseBilingualText(faq.question, language)}</h3>
                <ChevronDown
                  size={20}
                  className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/10 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">{parseBilingualText(faq.answer, language)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contacto adicional */}
        <div className="mt-12 bg-card border-2 border-primary/30 rounded-lg p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-3">{t("faq.contactTitle")}</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            {t("faq.contactDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@villad2.com"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t("faq.email")}
            </a>
            <a
              href="tel:+34912345678"
              className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors"
            >
              {t("faq.call")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

