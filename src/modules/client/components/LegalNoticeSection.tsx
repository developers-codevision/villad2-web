import React from 'react';
import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';
const LegalNoticeSection = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {parseBilingualText('AVISO LEGAL / LEGAL NOTICE', language)}
          </h2>
        </div>
        <div className="space-y-6 text-muted-foreground text-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('1. Datos identificativos del titular / 1. Identifying data of the owner', language)}</h3>
            <p>{parseBilingualText('En cumplimiento del deber de información, se comunican los siguientes datos del titular de este sitio web: / In compliance with the duty of information, the following data of the owner of this website are communicated:', language)}</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{parseBilingualText('Nombre comercial: Hostal Boutique Villa D2 / Trade name: Hostal Boutique Villa D2', language)}</li>
              <li>{parseBilingualText('Dirección: Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba / Address: Calle 37 #14 e/Paseo y Calle 2, Vedado, Havana, Cuba', language)}</li>
              <li>{parseBilingualText('Correo electrónico: hostal.villad2@gmail.com / Email: hostal.villad2@gmail.com', language)}</li>
              <li>{parseBilingualText('Teléfonos: +53 78820045 / +53 63511623 / +53 50970588 / Phones: +53 78820045 / +53 63511623 / +53 50970588', language)}</li>
              <li>{parseBilingualText('WhatsApp: +53 63511623 / WhatsApp: +53 63511623', language)}</li>
              <li>{parseBilingualText('Sitio web: https://villad2.com / Website: https://villad2.com', language)}</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('2. Objeto y condiciones de uso / 2. Purpose and conditions of use', language)}</h3>
            <p className="mb-2">{parseBilingualText('Este sitio web tiene como finalidad informar sobre los servicios de alojamiento del Hostal Boutique Villa D2 y facilitar el contacto con potenciales huéspedes. El acceso y uso de este sitio implica la aceptación de las presentes condiciones. / The purpose of this website is to provide information about the accommodation services of Hostal Boutique Villa D2 and to facilitate contact with potential guests. Access to and use of this site implies acceptance of these conditions.', language)}</p>
            <p>{parseBilingualText('El titular se reserva el derecho a modificar, suspender o interrumpir el acceso al sitio web en cualquier momento y sin previo aviso. / The owner reserves the right to modify, suspend or interrupt access to the website at any time and without prior notice.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('3. Propiedad intelectual / 3. Intellectual property', language)}</h3>
            <p className="mb-2">{parseBilingualText('Todos los contenidos de este sitio web, incluyendo textos, fotografías, logotipos, diseño gráfico y código fuente, son propiedad de Hostal Boutique Villa D2 o de terceros que han autorizado su uso, y están protegidos por los derechos de propiedad intelectual aplicables. / All contents of this website, including texts, photographs, logos, graphic design and source code, are the property of Hostal Boutique Villa D2 or third parties who have authorized their use, and are protected by applicable intellectual property rights.', language)}</p>
            <p>{parseBilingualText('Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación de cualquier contenido de este sitio sin autorización previa y por escrito del titular. / The reproduction, distribution, public communication or transformation of any content on this site without the prior written authorization of the owner is expressly prohibited.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('4. Limitación de responsabilidad / 4. Limitation of liability', language)}</h3>
            <p>{parseBilingualText('Villa D2 no se hace responsable de: / Villa D2 is not responsible for:', language)}</p>
            <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
              <li>{parseBilingualText('Errores u omisiones en los contenidos del sitio web / Errors or omissions in the contents of the website', language)}</li>
              <li>{parseBilingualText('La disponibilidad técnica del sitio (interrupciones por mantenimiento, fallos técnicos, etc.) / The technical availability of the site (interruptions due to maintenance, technical failures, etc.)', language)}</li>
              <li>{parseBilingualText('Los contenidos o servicios de sitios web de terceros a los que se enlace desde este sitio / The contents or services of third-party websites linked from this site', language)}</li>
              <li>{parseBilingualText('Los daños que pudieran derivarse del uso de información publicada en este sitio / Damages that may arise from the use of information published on this site', language)}</li>
            </ul>
            <p>{parseBilingualText('La información sobre tarifas, disponibilidad y servicios publicada en este sitio web tiene carácter orientativo. La confirmación definitiva de cualquier reserva se realiza a través del proceso de reserva correspondiente. / The information on rates, availability and services published on this website is indicative. The final confirmation of any reservation is made through the corresponding reservation process.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('5. Enlaces a terceros / 5. Links to third parties', language)}</h3>
            <p>{parseBilingualText('Este sitio puede contener enlaces a plataformas externas como Airbnb, redes sociales u otros servicios de terceros. Villa D2 no controla ni es responsable de los contenidos, políticas de privacidad o prácticas de dichos sitios. El acceso a esos enlaces se realiza bajo la responsabilidad exclusiva del usuario. / This site may contain links to external platforms such as Airbnb, social networks or other third-party services. Villa D2 does not control and is not responsible for the contents, privacy policies or practices of such sites. Access to these links is at the user\'s sole responsibility.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('6. Política de privacidad y cookies / 6. Privacy and cookie policy', language)}</h3>
            <p>{parseBilingualText('El tratamiento de datos personales recogidos a través de este sitio se rige por nuestra Política de Privacidad. El uso de cookies está regulado por nuestra Política de Cookies. / The processing of personal data collected through this site is governed by our Privacy Policy. The use of cookies is regulated by our Cookie Policy.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('7. Ley aplicable y jurisdicción / 7. Applicable law and jurisdiction', language)}</h3>
            <p className="mb-2">{parseBilingualText('Este aviso legal se rige por la legislación de la República de Cuba. Para cualquier controversia derivada del uso de este sitio web, las partes se someten a los tribunales competentes según la normativa cubana vigente. / This legal notice is governed by the laws of the Republic of Cuba. For any controversy arising from the use of this website, the parties submit to the competent courts according to the current Cuban regulations.', language)}</p>
            <p>{parseBilingualText('Nota para huéspedes de la UE: Si eres residente en la Unión Europea y surge una disputa relacionada con nuestros servicios, también puedes acudir a los mecanismos de resolución de conflictos disponibles en tu país de residencia. / Note for EU guests: If you are an EU resident and a dispute related to our services arises, you can also use the dispute resolution mechanisms available in your country of residence.', language)}</p>
          </div>
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('8. Contacto / 8. Contact', language)}</h3>
            <p>{parseBilingualText('Para cualquier consulta relacionada con este aviso legal: / For any queries related to this legal notice:', language)}</p>
            <ul className="mt-2 space-y-1">
              <li>📧 hostal.villad2@gmail.com</li>
              <li>📞 +53 63511623</li>
              <li>📍 Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LegalNoticeSection;
