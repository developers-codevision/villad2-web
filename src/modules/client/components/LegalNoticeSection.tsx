import React from 'react';

const LegalNoticeSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            AVISO LEGAL
          </h2>
        </div>

        <div className="space-y-6 text-muted-foreground text-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">1. Datos identificativos del titular</h3>
            <p>En cumplimiento del deber de información, se comunican los siguientes datos del titular de este sitio web:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nombre comercial: Hostal Boutique Villa D2</li>
              <li>Dirección: Calle 37 #14 e/Paseo y Calle 2, Vedado, La Habana, Cuba</li>
              <li>Correo electrónico: hostal.villad2@gmail.com</li>
              <li>Teléfonos: +53 78820045 / +53 63511623 / +53 50970588</li>
              <li>WhatsApp: +53 63511623</li>
              <li>Sitio web: https://villad2.com</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">2. Objeto y condiciones de uso</h3>
            <p className="mb-2">Este sitio web tiene como finalidad informar sobre los servicios de alojamiento del Hostal Boutique Villa D2 y facilitar el contacto con potenciales huéspedes. El acceso y uso de este sitio implica la aceptación de las presentes condiciones.</p>
            <p>El titular se reserva el derecho a modificar, suspender o interrumpir el acceso al sitio web en cualquier momento y sin previo aviso.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">3. Propiedad intelectual</h3>
            <p className="mb-2">Todos los contenidos de este sitio web, incluyendo textos, fotografías, logotipos, diseño gráfico y código fuente, son propiedad de Hostal Boutique Villa D2 o de terceros que han autorizado su uso, y están protegidos por los derechos de propiedad intelectual aplicables.</p>
            <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación de cualquier contenido de este sitio sin autorización previa y por escrito del titular.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">4. Limitación de responsabilidad</h3>
            <p>Villa D2 no se hace responsable de:</p>
            <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
              <li>Errores u omisiones en los contenidos del sitio web</li>
              <li>La disponibilidad técnica del sitio (interrupciones por mantenimiento, fallos técnicos, etc.)</li>
              <li>Los contenidos o servicios de sitios web de terceros a los que se enlace desde este sitio</li>
              <li>Los daños que pudieran derivarse del uso de información publicada en este sitio</li>
            </ul>
            <p>La información sobre tarifas, disponibilidad y servicios publicada en este sitio web tiene carácter orientativo. La confirmación definitiva de cualquier reserva se realiza a través del proceso de reserva correspondiente.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">5. Enlaces a terceros</h3>
            <p>Este sitio puede contener enlaces a plataformas externas como Airbnb, redes sociales u otros servicios de terceros. Villa D2 no controla ni es responsable de los contenidos, políticas de privacidad o prácticas de dichos sitios. El acceso a esos enlaces se realiza bajo la responsabilidad exclusiva del usuario.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">6. Política de privacidad y cookies</h3>
            <p>El tratamiento de datos personales recogidos a través de este sitio se rige por nuestra Política de Privacidad. El uso de cookies está regulado por nuestra Política de Cookies.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">7. Ley aplicable y jurisdicción</h3>
            <p className="mb-2">Este aviso legal se rige por la legislación de la República de Cuba. Para cualquier controversia derivada del uso de este sitio web, las partes se someten a los tribunales competentes según la normativa cubana vigente.</p>
            <p>Nota para huéspedes de la UE: Si eres residente en la Unión Europea y surge una disputa relacionada con nuestros servicios, también puedes acudir a los mecanismos de resolución de conflictos disponibles en tu país de residencia.</p>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">8. Contacto</h3>
            <p>Para cualquier consulta relacionada con este aviso legal:</p>
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
