import React from 'react';
import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';
const PrivacyPolicySection = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        {/* POLÍTICA DE PRIVACIDAD */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {parseBilingualText('POLÍTICA DE PRIVACIDAD / PRIVACY POLICY', language)}
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground text-sm">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('1. Responsable del tratamiento de datos / 1. Data controller', language)}</h3>
              <p>{parseBilingualText('El responsable del tratamiento de los datos personales recogidos a través de este sitio web es Hostal Boutique Villa D2, con dirección en Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba, y contacto en hostal.villad2@gmail.com. / The data controller for the personal data collected through this website is Hostal Boutique Villa D2, located at Calle 37 #14 e/Paseo y Calle 2, Vedado, Havana, Cuba, contact email: hostal.villad2@gmail.com.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('2. Datos que recopilamos / 2. Data we collect', language)}</h3>
              <p>{parseBilingualText('Recopilamos datos personales en las siguientes situaciones: / We collect personal data in the following situations:', language)}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>{parseBilingualText('a) Formulario de contacto y reservas / a) Contact and booking form', language)}</strong>: {parseBilingualText('Nombre y apellidos, Dirección de correo electrónico, Número de teléfono, Fechas de llegada y salida, Cualquier mensaje o solicitud especial que nos envíes / Full name, Email address, Phone number, Arrival and departure dates, Any message or special request you send us', language)}</li>
                <li><strong>{parseBilingualText('b) Comunicación directa (WhatsApp, email, teléfono) / b) Direct communication (WhatsApp, email, phone)', language)}</strong>: {parseBilingualText('Los datos que nos proporcionas voluntariamente al comunicarte con nosotros / The data you voluntarily provide when communicating with us', language)}</li>
                <li><strong>{parseBilingualText('c) Navegación en el sitio web / c) Website navigation', language)}</strong>: {parseBilingualText('Datos técnicos de navegación (dirección IP, tipo de navegador, páginas visitadas) mediante cookies y herramientas de análisis. Consulta nuestra Política de Cookies para más información. / Technical browsing data (IP address, browser type, visited pages) via cookies and analytics tools. See our Cookie Policy for more information.', language)}</li>
                <li><strong>{parseBilingualText('d) Durante tu estancia / d) During your stay', language)}</strong>: {parseBilingualText('Documento de identidad o pasaporte (requerido por la normativa cubana de registro de huéspedes), Datos de pago necesarios para procesar tu reserva / Identity document or passport (required by Cuban regulations for guest registration), Payment data necessary to process your reservation', language)}</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('3. Finalidad del tratamiento / 3. Purpose of processing', language)}</h3>
              <p>{parseBilingualText('Utilizamos tus datos para: / We use your data to:', language)}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{parseBilingualText('Gestionar y confirmar reservas de alojamiento / Manage and confirm accommodation reservations', language)}</li>
                <li>{parseBilingualText('Responder a tus consultas y solicitudes / Respond to your inquiries and requests', language)}</li>
                <li>{parseBilingualText('Garantizar el cumplimiento de las obligaciones legales de registro de huéspedes en Cuba / Guarantee compliance with legal obligations for guest registration in Cuba', language)}</li>
                <li>{parseBilingualText('Mejorar nuestros servicios y la experiencia en el sitio web / Improve our services and website experience', language)}</li>
                <li>{parseBilingualText('Enviarte información sobre tu estancia (no realizamos envíos de marketing sin tu consentimiento explícito) / Send you information about your stay (we do not send marketing communications without your explicit consent)', language)}</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('4. Base legal para el tratamiento / 4. Legal basis for processing', language)}</h3>
              <p>{parseBilingualText('El tratamiento de tus datos se basa en: / The processing of your data is based on:', language)}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{parseBilingualText('Ejecución de un contrato: cuando realizas una reserva, necesitamos tus datos para prestarte el servicio. / Execution of a contract: when you make a reservation, we need your data to provide the service.', language)}</li>
                <li>{parseBilingualText('Obligación legal: el registro de huéspedes está exigido por la normativa cubana de turismo. / Legal obligation: guest registration is required by Cuban tourism regulations.', language)}</li>
                <li>{parseBilingualText('Consentimiento: para cualquier comunicación opcional, como correos informativos. / Consent: for any optional communication, such as informational emails.', language)}</li>
                <li>{parseBilingualText('Interés legítimo: para la seguridad del establecimiento y la mejora de nuestros servicios. / Legitimate interest: for the security of the establishment and the improvement of our services.', language)}</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('5. Plataformas y terceros / 5. Platforms and third parties', language)}</h3>
              <p className="mb-2">{parseBilingualText('Si realizas tu reserva a través de Airbnb (airbnb.com), ten en cuenta que dicha plataforma actúa como responsable independiente del tratamiento de tus datos en su entorno. Airbnb tiene su propia política de privacidad, disponible en https://www.airbnb.com/help/article/2855, que te recomendamos consultar. / If you make your reservation through Airbnb (airbnb.com), please note that this platform acts as an independent data controller in its environment. Airbnb has its own privacy policy, available at https://www.airbnb.com/help/article/2855, which we recommend you consult.', language)}</p>
              <p className="mb-2">{parseBilingualText('Los datos que nos comparte Airbnb para gestionar tu reserva (nombre, fechas de estancia, información de contacto) son tratados por Villa D2 exclusivamente para la prestación del servicio de alojamiento. / The data shared by Airbnb to manage your reservation (name, dates of stay, contact information) are processed by Villa D2 exclusively to provide the accommodation service.', language)}</p>
              <p>{parseBilingualText('No vendemos ni cedemos tus datos personales a terceros con fines comerciales. / We do not sell or transfer your personal data to third parties for commercial purposes.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('6. Conservación de los datos / 6. Data retention', language)}</h3>
              <p>{parseBilingualText('Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y con las obligaciones legales aplicables. Los datos de registro de huéspedes se conservan conforme a la normativa cubana vigente. / We retain your personal data for the time necessary to fulfill the purpose for which they were collected and with applicable legal obligations. Guest registration data are retained in accordance with current Cuban regulations.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('7. Tus derechos / 7. Your rights', language)}</h3>
              <p>{parseBilingualText('Si te encuentras en la Unión Europea o en cualquier otro lugar, tienes derecho a: / If you are in the European Union or anywhere else, you have the right to:', language)}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 mb-2">
                <li>{parseBilingualText('Acceder a los datos personales que tenemos sobre ti / Access the personal data we hold about you', language)}</li>
                <li>{parseBilingualText('Rectificar datos inexactos o incompletos / Rectify inaccurate or incomplete data', language)}</li>
                <li>{parseBilingualText('Suprimir tus datos ("derecho al olvido"), cuando proceda / Delete your data ("right to be forgotten"), where applicable', language)}</li>
                <li>{parseBilingualText('Oponerte al tratamiento de tus datos / Object to the processing of your data', language)}</li>
                <li>{parseBilingualText('Portabilidad de tus datos en formato legible / Portability of your data in a readable format', language)}</li>
              </ul>
              <p>{parseBilingualText('Para ejercer cualquiera de estos derechos, escríbenos a hostal.villad2@gmail.com. Responderemos en un plazo máximo de 30 días. / To exercise any of these rights, write to us at hostal.villad2@gmail.com. We will respond within a maximum of 30 days.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('8. Seguridad de los datos / 8. Data security', language)}</h3>
              <p>{parseBilingualText('Aplicamos medidas técnicas y organizativas razonables para proteger tus datos personales frente a accesos no autorizados, pérdida o alteración. Sin embargo, ningún sistema de transmisión por internet es completamente seguro, por lo que no podemos garantizar una seguridad absoluta. / We apply reasonable technical and organizational measures to protect your personal data against unauthorized access, loss or alteration. However, no internet transmission system is completely secure, so we cannot guarantee absolute security.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('9. Cookies / 9. Cookies', language)}</h3>
              <p>{parseBilingualText('Nuestro sitio web puede utilizar cookies para mejorar tu experiencia de navegación. Para más información, consulta nuestra Política de Cookies. / Our website may use cookies to improve your browsing experience. For more information, see our Cookie Policy.', language)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('10. Cambios en esta política / 10. Changes to this policy', language)}</h3>
              <p>{parseBilingualText('Podemos actualizar esta política ocasionalmente para reflejar cambios en nuestras prácticas o en la legislación aplicable. La versión actualizada siempre estará disponible en esta página con la fecha de la última revisión. / We may update this policy occasionally to reflect changes in our practices or applicable legislation. The updated version will always be available on this page with the date of the last revision.', language)}</p>
            </div>
            <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{parseBilingualText('11. Contacto / 11. Contact', language)}</h3>
              <p>{parseBilingualText('Si tienes cualquier pregunta sobre esta política o sobre cómo tratamos tus datos, puedes contactarnos en: / If you have any questions about this policy or how we treat your data, you can contact us at:', language)}</p>
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
