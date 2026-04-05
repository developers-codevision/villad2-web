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
      answer: "El check-in está disponible a partir de las 4:00 PM, el check-out debe realizarse antes de las 12:00 M. Ofrecemos Early check-in y Late check-out sujeto a disponibilidad y con un costo adicional. Por favor solicítalo al momento de la reserva. / Check-in is available from 4:00 PM, check-out must be done before 12:00 PM. We offer Early check-in and Late check-out subject to availability and may incur an additional charge. Please request it when booking."
    },
    {
      question: "¿Puedo cancelar o modificar mi reserva? / Can I cancel or modify my reservation?",
      answer: "Sí puedes modificar o cancelar la reserva a través de tu cuenta. Para cancelaciones y modificaciones, consulta nuestras políticas que dependen de cuándo canceles o modifiques respecto a la fecha del check-in. / Yes you can modify or cancel the reservation through your account. For cancellations and modifications, check our policies which depend on when you cancel or modify relative to the check-in date."
    },
    {
      question: "¿Hay WiFi disponible en la habitación? / Is WiFi available in the room?",
      answer: "Sí, contamos con WiFi de alta velocidad en todos los puntos de la Villa. La contraseña se proporcionará en el check-in. / Yes, we have high-speed WiFi throughout the Villa. The password will be provided at check-in."
    },
    {
      question: "¿Se permiten mascotas en Villa D2? / Are pets allowed at Villa D2?",
      answer: "No se permiten mascotas ni animales guías en la instalación. / Pets and guide animals are not allowed on the premises."
    },
    {
      question: "¿Está incluido el desayuno en la reserva? / Is breakfast included in the reservation?",
      answer: "No está incluido en el precio de la habitación, lo puedes reservar y pagar o concertarlo durante el check in. El horario del desayuno es de 7:00 AM a 11:00 AM con flexibilidad de horario. Si tienes necesidades dietéticas especiales, avísanos con anticipación. / Breakfast is not included in the room price, you can book and pay for it or arrange it during check-in. Breakfast hours are from 7:00 AM to 11:00 AM with schedule flexibility. If you have special dietary needs, let us know in advance."
    },
    {
      question: "Ofrecen otros servicios de alimentación además de los desayunos? / Do you offer other food services besides breakfast?",
      answer: "Sí, hay otras opciones de alimentos y bebidas: • Carta variada de snacks / Varied snacks menu • Carta variada de bebidas y cocteles / Varied drinks and cocktails menu • Tables para almuerzos y cenas / Platters for lunches and dinners / Yes, there are additional food and beverage options including a varied snacks menu, drinks and cocktails, and platters for lunch and dinner."
    },
    {
      question: "¿Hay estacionamiento disponible? / Is parking available?",
      answer: "Sí, contamos con estacionamiento gratuito para todos nuestros huéspedes. Es seguro y vigilado 24/7. / Yes, we have free parking for all our guests. It is secure and monitored 24/7."
    },
    {
      question: "¿Qué métodos de pago aceptan? / What payment methods do you accept?",
      answer: "Aceptamos efectivo CUP, USD y Euros, transferencias, pagos a través de Zelle (para huéspedes desde USA), Bizum (para huéspedes desde España) y pagos a través de tarjetas de crédito internacionales. Todos los pagos son seguros y cifrados. / We accept CASH (CUP, USD, EUR), bank transfers, Zelle (for US guests), Bizum (for Spain guests) and international credit card payments. All payments are secure and encrypted."
    },
    {
      question: "¿Hay visitas guiadas disponibles? / Are guided tours available?",
      answer: "Sí, nuestro equipo de recepción puede ayudarte a organizar visitas guiadas a sitios de interés turístico, museos y centros recreativos locales. Contamos con coordinaciones especiales para trasladarte. Pregunta en recepción al llegar. / Yes, our reception team can help you organize guided tours to tourist sites, museums and local recreational centers. We can arrange transportation. Ask at reception upon arrival."
    },
    {
      question: "¿Cuál es la política de ruido en la propiedad? / What is the noise policy on the property?",
      answer: "Mantenemos un ambiente tranquilo para todos nuestros huéspedes. El ruido excesivo debe minimizarse después de las 10:00 PM. Si experimentas problemas de ruido, contacta inmediatamente a nuestro personal de seguridad disponible 24/7. / We maintain a quiet environment for all our guests. Excessive noise should be minimized after 10:00 PM. If you experience noise issues, contact our security staff available 24/7."
    },
    {
      question: "¿Necesito pagar depósito de seguridad? / Do I need to pay a security deposit?",
      answer: "El importe de la reserva actúa como depósito. No hay cargo de depósito adicional. Si hay daños o perjuicios al inmueble deberán ser pagados antes de la salida de la instalación. / The booking amount acts as a deposit. There is no additional deposit charge. Any damages must be paid before check-out."
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

      </div>
    </section>
  );
};

export default FAQSection;
