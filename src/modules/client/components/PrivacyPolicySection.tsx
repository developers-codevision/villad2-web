import { useLanguage } from '../contexts';

const PrivacyPolicySection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">

        {/* POLÍTICA DE PRIVACIDAD */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              POLÍTICA DE PRIVACIDAD
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground text-sm">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">1. Responsable del tratamiento de datos</h3>
              <p>El responsable del tratamiento de los datos personales recogidos a través de este sitio web es Hostal Boutique Villa D2, con dirección en Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba, y contacto en hostal.villad2@gmail.com.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">2. Datos que recopilamos</h3>
              <p>Recopilamos datos personales en las siguientes situaciones:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>a) Formulario de contacto y reservas</strong>: Nombre y apellidos, Dirección de correo electrónico, Número de teléfono, Fechas de llegada y salida, Cualquier mensaje o solicitud especial que nos envíes</li>
                <li><strong>b) Comunicación directa (WhatsApp, email, teléfono)</strong>: Los datos que nos proporcionas voluntariamente al comunicarte con nosotros</li>
                <li><strong>c) Navegación en el sitio web</strong>: Datos técnicos de navegación (dirección IP, tipo de navegador, páginas visitadas) mediante cookies y herramientas de análisis. Consulta nuestra Política de Cookies para más información.</li>
                <li><strong>d) Durante tu estancia</strong>: Documento de identidad o pasaporte (requerido por la normativa cubana de registro de huéspedes), Datos de pago necesarios para procesar tu reserva</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">3. Finalidad del tratamiento</h3>
              <p>Utilizamos tus datos para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gestionar y confirmar reservas de alojamiento</li>
                <li>Responder a tus consultas y solicitudes</li>
                <li>Garantizar el cumplimiento de las obligaciones legales de registro de huéspedes en Cuba</li>
                <li>Mejorar nuestros servicios y la experiencia en el sitio web</li>
                <li>Enviarte información sobre tu estancia (no realizamos envíos de marketing sin tu consentimiento explícito)</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">4. Base legal para el tratamiento</h3>
              <p>El tratamiento de tus datos se basa en:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Ejecución de un contrato: cuando realizas una reserva, necesitamos tus datos para prestarte el servicio.</li>
                <li>Obligación legal: el registro de huéspedes está exigido por la normativa cubana de turismo.</li>
                <li>Consentimiento: para cualquier comunicación opcional, como correos informativos.</li>
                <li>Interés legítimo: para la seguridad del establecimiento y la mejora de nuestros servicios.</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">5. Plataformas y terceros</h3>
              <p className="mb-2">Si realizas tu reserva a través de Airbnb (airbnb.com), ten en cuenta que dicha plataforma actúa como responsable independiente del tratamiento de tus datos en su entorno. Airbnb tiene su propia política de privacidad, disponible en https://www.airbnb.com/help/article/2855, que te recomendamos consultar.</p>
              <p className="mb-2">Los datos que nos comparte Airbnb para gestionar tu reserva (nombre, fechas de estancia, información de contacto) son tratados por Villa D2 exclusivamente para la prestación del servicio de alojamiento.</p>
              <p>No vendemos ni cedemos tus datos personales a terceros con fines comerciales.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">6. Conservación de los datos</h3>
              <p>Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y con las obligaciones legales aplicables. Los datos de registro de huéspedes se conservan conforme a la normativa cubana vigente.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">7. Tus derechos</h3>
              <p>Si te encuentras en la Unión Europea o en cualquier otro lugar, tienes derecho a:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 mb-2">
                <li>Acceder a los datos personales que tenemos sobre ti</li>
                <li>Rectificar datos inexactos o incompletos</li>
                <li>Suprimir tus datos ("derecho al olvido"), cuando proceda</li>
                <li>Oponerte al tratamiento de tus datos</li>
                <li>Portabilidad de tus datos en formato legible</li>
              </ul>
              <p>Para ejercer cualquiera de estos derechos, escríbenos a hostal.villad2@gmail.com. Responderemos en un plazo máximo de 30 días.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">8. Seguridad de los datos</h3>
              <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos personales frente a accesos no autorizados, pérdida o alteración. Sin embargo, ningún sistema de transmisión por internet es completamente seguro, por lo que no podemos garantizar una seguridad absoluta.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">9. Cookies</h3>
              <p>Nuestro sitio web puede utilizar cookies para mejorar tu experiencia de navegación. Para más información, consulta nuestra Política de Cookies.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">10. Cambios en esta política</h3>
              <p>Podemos actualizar esta política ocasionalmente para reflejar cambios en nuestras prácticas o en la legislación aplicable. La versión actualizada siempre estará disponible en esta página con la fecha de la última revisión.</p>
            </div>

            <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">11. Contacto</h3>
              <p>Si tienes cualquier pregunta sobre esta política o sobre cómo tratamos tus datos, puedes contactarnos en:</p>
              <ul className="mt-2 space-y-1">
                <li>📧 hostal.villad2@gmail.com</li>
                <li>📞 +53 78820045 / +53 63511623 / +53 50970588</li>
                <li>📍 Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PrivacyPolicySection;

