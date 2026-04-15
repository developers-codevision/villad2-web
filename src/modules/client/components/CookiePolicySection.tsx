import React from 'react';

const CookiePolicySection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            POLÍTICA DE COOKIES
          </h2>
        </div>

        <div className="space-y-6 text-muted-foreground text-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">1. Qué son las cookies?</h3>
            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, móvil o tablet) cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y recoja información sobre cómo navegas.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold mb-2">2. Qué cookies utiliza este sitio web?</h3>
            <p className="mb-4">Utilizamos los siguientes tipos de cookies:</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Nombre / Origen</th>
                  <th className="py-2 pr-4">Finalidad</th>
                  <th className="py-2">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Esenciales</td>
                  <td className="py-2 pr-4">Propias del sitio</td>
                  <td className="py-2 pr-4">Funcionamiento básico del sitio (sesión, seguridad)</td>
                  <td className="py-2">Sesión</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">De terceros</td>
                  <td className="py-2 pr-4">Airbnb (widget de reservas)</td>
                  <td className="py-2 pr-4">Integración con el sistema de reservas de Airbnb</td>
                  <td className="py-2">Variable</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">De preferencias</td>
                  <td className="py-2 pr-4">Propias del sitio</td>
                  <td className="py-2 pr-4">Recordar el idioma u otras preferencias del visitante</td>
                  <td className="py-2">1 año</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">3. Cookies esenciales</h3>
            <p>Estas cookies son imprescindibles para que el sitio funcione correctamente. No pueden desactivarse. No recopilan información personal identificable.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">4. Cookies de terceros</h3>
            <p>Algunos contenidos o funcionalidades de nuestro sitio pueden incluir elementos de plataformas externas como Airbnb. Estas plataformas pueden instalar sus propias cookies al interactuar con sus widgets. No controlamos estas cookies, consulta la política de cookies de cada plataforma para más información.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">5. Cómo gestionar o desactivar las cookies?</h3>
            <p>Puedes controlar y eliminar las cookies desde la configuración de tu navegador:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Chrome: Configuración → Privacidad y seguridad → Cookies</li>
              <li>Firefox: Ajustes → Privacidad y seguridad → Cookies y datos del sitio</li>
              <li>Safari: Preferencias → Privacidad → Gestionar datos de sitios web</li>
              <li>Edge: Configuración → Privacidad, búsqueda y servicios → Cookies</li>
            </ul>
            <p className="mt-2">Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento del sitio.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">6. Consentimiento</h3>
            <p>Al continuar navegando por este sitio web, aceptas el uso de cookies conforme a esta política. Si eres visitante de la Unión Europea, te mostraremos un banner de consentimiento de cookies al acceder al sitio por primera vez.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">7. Cambios en esta política</h3>
            <p>Podemos actualizar esta política ocasionalmente. La versión vigente siempre estará disponible en esta página con la fecha de la última revisión.</p>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">9. Contacto</h3>
            <p>Para cualquier pregunta sobre el uso de cookies:</p>
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

