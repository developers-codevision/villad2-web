import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';

const TermsAndConditionsSection = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {parseBilingualText('Términos y Condiciones / Terms and Conditions', language)}
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            {parseBilingualText('Por favor, lee atentamente nuestros términos y condiciones antes de hacer una reserva. / Please read our terms and conditions carefully before making a reservation.', language)}
          </p>
        </div>

        <div className="space-y-4">
          {/* Sección 1 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('1. Aceptación de Términos / 1. Acceptance of Terms', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Al hacer una reserva en Villa D2, aceptas todos nuestros términos y condiciones. La reserva constituye un contrato vinculante entre el huésped y Villa D2. Nos reservamos el derecho de rechazar o cancelar cualquier reserva que no cumpla con nuestras políticas. / By making a reservation at Villa D2, you accept all our terms and conditions. The reservation constitutes a binding contract between the guest and Villa D2. We reserve the right to reject or cancel any reservation that does not comply with our policies.', language)}
            </p>
          </div>

          {/* Sección 2 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('2. Disponibilidad y Confirmación / 2. Availability and Confirmation', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Las reservas están sujetas a disponibilidad. Mostraremos solo las fechas disponibles al momento de la búsqueda. Recibirás una confirmación por email una vez procesada la reserva. La tarifa final incluye el hospedaje, impuestos, comisiones y servicios básicos especificados. / Reservations are subject to availability. We will show only the dates available at the time of search. You will receive a confirmation by email once the reservation is processed. The final rate includes accommodation, taxes, fees and specified basic services.', language)}
            </p>
          </div>

          {/* Sección 3 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('3. Cancelaciones y Reembolsos / 3. Cancellations and Refunds', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Las políticas de cancelación se muestran claramente antes de confirmar la reserva. Las cancelaciones deben solicitarse directamente a través de nuestra plataforma o contactando a nuestro equipo. Los reembolsos se procesarán según las políticas vigentes en el momento de la reserva. / The cancellation policies are displayed clearly before confirming the reservation. Cancellations must be requested directly through our platform or by contacting our team. Refunds will be processed according to the policies in effect at the time of booking.', language)}
            </p>
          </div>

          {/* Sección 4 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('4. Responsabilidades del Huésped / 4. Guest Responsibilities', language)}</h3>
            <p className="text-muted-foreground text-sm mb-3">
              {parseBilingualText('Los huéspedes son responsables de: / Guests are responsible for:', language)}
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm ml-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>{parseBilingualText('Cumplir con las leyes locales durante su estancia / Comply with local laws during their stay', language)}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>{parseBilingualText('Respetar el código de conducta de la propiedad / Respect the property code of conduct', language)}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>{parseBilingualText('Proteger sus pertenencias personales / Protect their personal belongings', language)}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>{parseBilingualText('Reportar daños o problemas inmediatamente / Report damages or issues immediately', language)}</span>
              </li>
            </ul>
          </div>

          {/* Sección 5 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('5. Daños a la Propiedad / 5. Property Damage', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Los huéspedes son responsables de cualquier daño causado a la propiedad durante su estancia, más allá del desgaste normal. Villa D2 se reserva el derecho de cobrar por reparaciones o reemplazo de artículos dañados. Se verificará el estado de la propiedad durante el check-out. / Guests are responsible for any damage caused to the property during their stay, beyond normal wear and tear. Villa D2 reserves the right to charge for repairs or replacement of damaged items. The property will be inspected at check-out.', language)}
            </p>
          </div>

          {/* Sección 6 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('6. Privacidad y Datos Personales / 6. Privacy and Personal Data', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('La información personal se trata de acuerdo a nuestras políticas de privacidad. Solo usaremos los datos para procesar su reserva, enviar confirmaciones y ofrecerle información relevante. Nunca compartiremos tu información con terceros sin su consentimiento. / Personal information is handled in accordance with our privacy policies. We will only use the data to process your reservation, send confirmations and provide relevant information. We will never share your information with third parties without your consent.', language)}
            </p>
          </div>

          {/* Sección 7 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('7. Limitación de Responsabilidad / 7. Limitation of Liability', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Villa D2 no es responsable por daños indirectos, pérdida de datos, o inconvenientes causados por circunstancias fuera de nuestro control, incluyendo desastres naturales, huelgas, o cierres de gobierno. Nuestros equipos trabajan continuamente para brindar el mejor servicio posible. / Villa D2 is not responsible for indirect damages, data loss, or inconveniences caused by circumstances beyond our control, including natural disasters, strikes, or government closures. Our teams work continuously to provide the best possible service.', language)}
            </p>
          </div>

          {/* Sección 8 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">{parseBilingualText('8. Cambios en Políticas / 8. Changes to Policies', language)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {parseBilingualText('Nos reservamos el derecho de modificar estas políticas en cualquier momento. Los cambios entrarán en vigor a partir de su publicación. / We reserve the right to modify these policies at any time. Changes will take effect from their publication.', language)}
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('¿Preguntas sobre nuestros términos? / Questions about our terms?', language)}</h3>
            {language === 'es' ? (
              <div className="text-muted-foreground text-sm mb-4">
                <p>Si tienes dudas sobre nuestros términos y condiciones, no dudes en contactarnos.</p>
                <p className="mt-2"><span className="font-semibold">Email:</span> hostal.villad2@gmail.com</p>
                <p><span className="font-semibold">Teléfono:</span> +53 78820045</p>
                <p><span className="font-semibold">Whatsapp:</span> +53 50970588 / 59713605</p>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm mb-4">
                <p>If you have questions about our terms and conditions, do not hesitate to contact us.</p>
                <p className="mt-2"><span className="font-semibold">Email:</span> hostal.villad2@gmail.com</p>
                <p><span className="font-semibold">Phone:</span> +53 78820045</p>
                <p><span className="font-semibold">Whatsapp:</span> +53 50970588 / 59713605</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionsSection;
