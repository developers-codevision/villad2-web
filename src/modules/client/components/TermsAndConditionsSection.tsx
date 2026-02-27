const TermsAndConditionsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Términos y <span className="text-primary">Condiciones</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            Por favor, lee atentamente nuestros términos y condiciones antes de hacer una reserva.
          </p>
        </div>

        <div className="space-y-4">
          {/* Sección 1 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">1. Aceptación de Términos</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Al hacer una reserva en Villa D2, aceptas todos nuestros términos y condiciones. La reserva constituye un contrato vinculante entre el huésped y Villa D2. Nos reservamos el derecho de rechazar o cancelar cualquier reserva que no cumpla con nuestras políticas.
            </p>
          </div>

          {/* Sección 2 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">2. Disponibilidad y Confirmación</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Las reservas están sujetas a disponibilidad. Mostraremos solo las fechas disponibles al momento de tu búsqueda. Recibirás una confirmación por email una vez procesada tu reserva. La tarifa final incluye el hospedaje, impuestos locales y servicios básicos especificados.
            </p>
          </div>

          {/* Sección 3 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">3. Cancelaciones y Reembolsos</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Las políticas de cancelación se muestran claramente antes de confirmar tu reserva. Las cancelaciones deben solicitarse directamente a través de nuestra plataforma o contactando a nuestro equipo. Los reembolsos se procesarán según las políticas vigentes en el momento de la reserva.
            </p>
          </div>

          {/* Sección 4 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">4. Responsabilidades del Huésped</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Los huéspedes son responsables de:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm ml-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Cumplir con las leyes locales durante su estancia</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Respetar el código de conducta de la propiedad</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Proteger sus pertenencias personales</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Reportar daños o problemas inmediatamente</span>
              </li>
            </ul>
          </div>

          {/* Sección 5 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">5. Daños a la Propiedad</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Los huéspedes son responsables de cualquier daño causado a la propiedad durante su estancia, más allá del desgaste normal. Villa D2 se reserva el derecho de cobrar por reparaciones o reemplazo de artículos dañados. Se realizará un estado de la propiedad al check-out.
            </p>
          </div>

          {/* Sección 6 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">6. Privacidad y Datos Personales</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tu información personal se trata de acuerdo a nuestras políticas de privacidad. Solo usaremos tus datos para procesar tu reserva, enviar confirmaciones y ofrecerte información relevante. Nunca compartiremos tu información con terceros sin tu consentimiento.
            </p>
          </div>

          {/* Sección 7 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">7. Limitación de Responsabilidad</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Villa D2 no es responsable por daños indirectos, pérdida de datos, o inconvenientes causados por circunstancias fuera de nuestro control, incluyendo desastres naturales, huelgas, o cierres de gobierno. Nuestros equipos trabajan continuamente para brindar el mejor servicio posible.
            </p>
          </div>

          {/* Sección 8 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-3">8. Cambios en Políticas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nos reservamos el derecho de modificar estas políticas en cualquier momento. Los cambios entrarán en vigor 30 días después de su publicación. Continuarás siendo vinculado por las políticas vigentes al momento de tu reserva para esa estancia específica.
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">¿Preguntas sobre nuestros términos?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Si tienes dudas sobre nuestros términos y condiciones, no dudes en contactarnos. Nuestro equipo está disponible para aclarar cualquier aspecto.
            </p>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Email:</span> info@villad2.com</p>
              <p><span className="font-semibold">Teléfono:</span> +34 912 345 678</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionsSection;

