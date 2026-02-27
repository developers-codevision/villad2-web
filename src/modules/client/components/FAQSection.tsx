import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "¿Cuál es el horario de check-in y check-out?",
      answer: "El check-in está disponible a partir de las 3:00 PM y el check-out debe realizarse antes de las 11:00 AM. Podemos ofrecer check-in anticipado o check-out tardío sujeto a disponibilidad y con un costo adicional. Por favor solicítalo al momento de la reserva."
    },
    {
      question: "¿Puedo cancelar o modificar mi reserva?",
      answer: "Sí, puedes modificar tu reserva en cualquier momento a través de tu cuenta. Para cancelaciones, consulta nuestras políticas que dependen de cuándo canceles respecto a tu fecha de check-in. Cancela con al menos 14 días de anticipación para obtener un reembolso completo."
    },
    {
      question: "¿Hay WiFi disponible en la habitación?",
      answer: "Sí, contamos con WiFi de alta velocidad en toda la propiedad, incluyendo todas las habitaciones, áreas comunes y el restaurante. La contraseña se proporcionará al check-in y también se enviará por email con tu confirmación."
    },
    {
      question: "¿Se permiten mascotas en Villa D2?",
      answer: "Sí, aceptamos mascotas pequeñas con un cargo adicional de $20 USD por noche. Las mascotas deben estar debidamente vacunadas y el huésped es responsable de cualquier daño que causen. Por favor notifícanos al momento de la reserva."
    },
    {
      question: "¿Está incluido el desayuno en la reserva?",
      answer: "Sí, el desayuno continental está incluido en todas nuestras tarifas de habitación. Se sirve de 7:00 AM a 11:00 AM en nuestro comedor. Si tienes necesidades dietéticas especiales, avísanos con anticipación para poder acomodarte."
    },
    {
      question: "¿Hay estacionamiento disponible?",
      answer: "Sí, contamos con estacionamiento gratuito para todos nuestros huéspedes. Es seguro y vigilado 24/7. No hay cargo adicional por estacionamiento y está disponible por orden de llegada en el caso de estancias prolongadas."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos transferencias bancarias a través de Zelle (para huéspedes estadounidenses), Bizum (para huéspedes españoles) y pagos con tarjeta de crédito a través de Stripe. Todos los pagos son seguros y cifrados."
    },
    {
      question: "¿Hay visitas guiadas disponibles?",
      answer: "Sí, nuestro equipo de recepción puede ayudarte a organizar visitas guiadas a sitios de interés turístico, museos y centros recreativos locales. Contamos con coordinaciones especiales para trasladarte. Pregunta en recepción al llegar."
    },
    {
      question: "¿Cuál es la política de ruido en la propiedad?",
      answer: "Mantenemos un ambiente tranquilo para todos nuestros huéspedes. El ruido excesivo debe minimizarse después de las 10:00 PM. Si experimentas problemas de ruido, contacta inmediatamente a nuestro personal de seguridad disponible 24/7."
    },
    {
      question: "¿Necesito pagar depósito de seguridad?",
      answer: "El monto de la reserva actúa como depósito. No hay cargo de depósito adicional. Si no hay daños durante tu estancia, se procesa un reembolso completo después del check-out según nuestras políticas de pago."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Preguntas <span className="text-primary">Frecuentes</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre tu estancia en Villa D2.
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
                <h3 className="text-left font-semibold text-base pr-4">{faq.question}</h3>
                <ChevronDown
                  size={20}
                  className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/10 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contacto adicional */}
        <div className="mt-12 bg-card border-2 border-primary/30 rounded-lg p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-3">¿No encontraste tu respuesta?</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Nuestro equipo de atención al cliente está disponible para ayudarte. Contáctanos en cualquier momento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@villad2.com"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Enviar Email
            </a>
            <a
              href="tel:+34912345678"
              className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors"
            >
              Llamar Ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;


