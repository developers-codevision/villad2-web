import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';

const PrivacyPolicySection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {parseBilingualText('Política de Privacidad / Privacy Policy', language)}
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            {parseBilingualText('En Villa D2 nos comprometemos a proteger tu privacidad y los datos personales que compartes con nosotros. / At Villa D2 we are committed to protecting your privacy and the personal data you share with us.', language)}
          </p>
        </div>

        <div className="space-y-4 text-muted-foreground text-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('1. Datos que recopilamos / 1. Data we collect', language)}</h3>
            <p>
              {parseBilingualText(
                'Recopilamos la información que nos facilitas al hacer una reserva, como nombre, email, teléfono, documento de identidad y detalles de tarjeta cuando aplica. También podemos recopilar información relacionada con tu estancia para mejorar nuestros servicios. / We collect the information you provide when making a reservation, such as name, email, phone number, ID details and card details when applicable. We may also collect information related to your stay to improve our services.',
                language
              )}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('2. Finalidad del tratamiento / 2. Purpose of processing', language)}</h3>
            <p>
              {parseBilingualText(
                'Los datos se usan para gestionar reservas, comunicarnos contigo, procesar pagos y ofrecer servicios relacionados con tu estancia. / Data is used to manage bookings, communicate with you, process payments and provide services related to your stay.',
                language
              )}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('3. Conservación / 3. Retention', language)}</h3>
            <p>
              {parseBilingualText(
                'Conservamos los datos solo el tiempo necesario para cumplir con las finalidades descritas y según los plazos legales aplicables. / We retain data only for as long as necessary to fulfil the purposes described and in accordance with applicable legal retention periods.',
                language
              )}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('4. Tus derechos / 4. Your rights', language)}</h3>
            <p>
              {parseBilingualText(
                'Puedes solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos. Para ejercer estos derechos contacta a hostal.villad2@gmail.com. / You may request access, rectification, deletion, objection, restriction and portability of your data. To exercise these rights contact hostal.villad2@gmail.com.',
                language
              )}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('5. Seguridad / 5. Security', language)}</h3>
            <p>
              {parseBilingualText(
                'Adoptamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. / We adopt technical and organizational measures to protect your data against unauthorized access, loss or alteration.',
                language
              )}
            </p>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{parseBilingualText('Contacto / Contact', language)}</h3>
            {language === 'es' ? (
              <div className="text-muted-foreground text-sm">
                <p className="mb-2">Si tienes consultas sobre la política de privacidad, contáctanos:</p>
                <p><span className="font-semibold">Email:</span> hostal.villad2@gmail.com</p>
                <p><span className="font-semibold">Teléfono:</span> +53 78820045</p>
                <p><span className="font-semibold">Whatsapp:</span> +53 50970588 / 59713605</p>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                <p className="mb-2">If you have any questions about the privacy policy, contact us:</p>
                <p><span className="font-semibold">Email:</span> hostal.villad2@gmail.com</p>
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

export default PrivacyPolicySection;

