import React from 'react';
import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';
const CookiePolicySection = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {parseBilingualText('POLÍTICA DE COOKIES / COOKIE POLICY', language)}
          </h2>
        </div>
        <div className="space-y-6 text-muted-foreground text-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('1. ¿Qué son las cookies? / 1. What are cookies?', language)}</h3>
            <p>{parseBilingualText('Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, móvil o tablet) cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y recoja información sobre cómo navegas. / Cookies are small text files that are stored on your device (computer, mobile or tablet) when you visit a website. They allow the site to remember your preferences and collect information about how you browse.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('2. ¿Qué cookies utiliza este sitio web? / 2. What cookies does this website use?', language)}</h3>
            <p className="mb-4">{parseBilingualText('Utilizamos los siguientes tipos de cookies: / We use the following types of cookies:', language)}</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4">{parseBilingualText('Tipo / Type', language)}</th>
                  <th className="py-2 pr-4">{parseBilingualText('Nombre / Origen / Name / Origin', language)}</th>
                  <th className="py-2 pr-4">{parseBilingualText('Finalidad / Purpose', language)}</th>
                  <th className="py-2">{parseBilingualText('Duración / Duration', language)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">{parseBilingualText('Esenciales / Essential', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Propias del sitio / Own site', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Funcionamiento básico del sitio (sesión, seguridad) / Basic site functionality (session, security)', language)}</td>
                  <td className="py-2">{parseBilingualText('Sesión / Session', language)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">{parseBilingualText('De terceros / Third-party', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Airbnb (widget de reservas) / Airbnb (booking widget)', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Integración con el sistema de reservas de Airbnb / Integration with Airbnb booking system', language)}</td>
                  <td className="py-2">{parseBilingualText('Variable / Variable', language)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">{parseBilingualText('De preferencias / Preferences', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Propias del sitio / Own site', language)}</td>
                  <td className="py-2 pr-4">{parseBilingualText('Recordar el idioma u otras preferencias del visitante / Remember the language or other preferences of the visitor', language)}</td>
                  <td className="py-2">{parseBilingualText('1 año / 1 year', language)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('3. Cookies esenciales / 3. Essential cookies', language)}</h3>
            <p>{parseBilingualText('Estas cookies son imprescindibles para que el sitio funcione correctamente. No pueden desactivarse. No recopilan información personal identificable. / These cookies are essential for the site to function properly. They cannot be disabled. They do not collect personally identifiable information.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('4. Cookies de terceros / 4. Third-party cookies', language)}</h3>
            <p>{parseBilingualText('Algunos contenidos o funcionalidades de nuestro sitio pueden incluir elementos de plataformas externas como Airbnb. Estas plataformas pueden instalar sus propias cookies al interactuar con sus widgets. No controlamos estas cookies, consulta la política de cookies de cada plataforma para más información. / Some content or functionality of our site may include elements from external platforms such as Airbnb. These platforms may install their own cookies when you interact with their widgets. We do not control these cookies, please consult the cookie policy of each platform for more information.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('5. ¿Cómo gestionar o desactivar las cookies? / 5. How to manage or disable cookies?', language)}</h3>
            <p>{parseBilingualText('Puedes controlar y eliminar las cookies desde la configuración de tu navegador: / You can control and delete cookies from your browser settings:', language)}</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{parseBilingualText('Chrome: Configuración → Privacidad y seguridad → Cookies / Chrome: Settings → Privacy and security → Cookies', language)}</li>
              <li>{parseBilingualText('Firefox: Ajustes → Privacidad y seguridad → Cookies y datos del sitio / Firefox: Settings → Privacy and security → Cookies and site data', language)}</li>
              <li>{parseBilingualText('Safari: Preferencias → Privacidad → Gestionar datos de sitios web / Safari: Preferences → Privacy → Manage website data', language)}</li>
              <li>{parseBilingualText('Edge: Configuración → Privacidad, búsqueda y servicios → Cookies / Edge: Settings → Privacy, search and services → Cookies', language)}</li>
            </ul>
            <p className="mt-2">{parseBilingualText('Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento del sitio. / Please note that disabling certain cookies may affect the functioning of the site.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('6. Consentimiento / 6. Consent', language)}</h3>
            <p>{parseBilingualText('Al continuar navegando por este sitio web, aceptas el uso de cookies conforme a esta política. Si eres visitante de la Unión Europea, te mostraremos un banner de consentimiento de cookies al acceder al sitio por primera vez. / By continuing to browse this website, you agree to the use of cookies in accordance with this policy. If you are a visitor from the European Union, we will show you a cookie consent banner when you access the site for the first time.', language)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('7. Cambios en esta política / 7. Changes to this policy', language)}</h3>
            <p>{parseBilingualText('Podemos actualizar esta política ocasionalmente. La versión vigente siempre estará disponible en esta página con la fecha de la última revisión. / We may update this policy occasionally. The current version will always be available on this page with the date of the last revision.', language)}</p>
          </div>
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('8. Contacto / 8. Contact', language)}</h3>
            <p>{parseBilingualText('Para cualquier pregunta sobre el uso de cookies: / For any questions about the use of cookies:', language)}</p>
            <ul className="mt-2 space-y-1">
              <li>📧 hostal.villad2@gmail.com</li>
              <li>📞 +53 78820045 / +53 63511623 / +53 50970588</li>
              <li>📍 Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CookiePolicySection;
