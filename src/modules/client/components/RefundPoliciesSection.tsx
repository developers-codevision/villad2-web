import { AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts';
import { parseBilingualText } from '../utils/bilingualHelpers';

const RefundPoliciesSection = () => {
  const { language } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {parseBilingualText('Políticas de Reembolsos / Refund Policies', language)}
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            {parseBilingualText('Queremos que viajes con confianza. Conoce nuestras políticas flexibles de cancelación. / We want you to travel with confidence. Learn about our flexible cancellation policies.', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cancelación con tiempo */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <CheckCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">{parseBilingualText('Cancelación con Tiempo / Cancellation in Advance', language)}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {parseBilingualText('Si cancelas con más de 14 días antes de la fecha de check-in: / If you cancel more than 14 days before the check-in date:', language)}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('100% del importe será reembolsado / 100% of the amount will be refunded', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Sin penalizaciones adicionales / No additional penalties', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Procesamiento en 7-10 días hábiles / Processing in 7-10 business days', language)}
              </li>
            </ul>
          </div>

          {/* Cancelación últimos días */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">{parseBilingualText('Cancelación Tardía / Late Cancellation', language)}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {parseBilingualText('Si cancelas con menos de 14 días antes de la fecha de check-in: / If you cancel less than 14 days before the check-in date:', language)}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Se retiene el 50% del importe de la reserva / 50% of the booking amount will be retained', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('El 50% restante se reembolsa / The remaining 50% will be refunded', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Procesamiento en 10 días hábiles / Processing in 10 business days', language)}
              </li>
            </ul>
          </div>

          {/* No-show */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">{parseBilingualText('No-Show / No-Show', language)}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {parseBilingualText('Si no llegas a la fecha de check-in sin aviso previo: / If you do not arrive on the check-in date without prior notice:', language)}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Se cobra el 100% del importe de la reserva / 100% of the booking amount will be charged', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('No se realiza reembolso alguno / No refunds will be issued', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Te recomendamos comunicarte con nosotros / We recommend contacting us', language)}
              </li>
            </ul>
          </div>

          {/* Modificaciones */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <CheckCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">{parseBilingualText('Modificaciones / Modifications', language)}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {parseBilingualText('Puedes modificar la reserva hasta 72 horas de anticipación: / You can modify the reservation up to 72 hours in advance:', language)}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Cambiar fechas sin cargo adicional, en dependencia de la disponibilidad / Change dates at no extra charge, subject to availability', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Diferencia de precio se ajusta automáticamente / Price differences will be adjusted automatically', language)}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {parseBilingualText('Solo se requiere confirmación / Only confirmation is required', language)}
              </li>
            </ul>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4">{parseBilingualText('Información Importante / Important Information', language)}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{parseBilingualText('Los reembolsos se procesan al método de pago original utilizado. / Refunds are processed to the original payment method used.', language)}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{parseBilingualText('Algunos bancos pueden tardar hasta 10 días adicionales en reflejar el reembolso en tu cuenta. / Some banks may take up to 10 additional days to reflect the refund in your account.', language)}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{parseBilingualText('Los impuestos y tasas no son reembolsables según la legislación local. / Taxes and fees are non-refundable according to local legislation.', language)}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>{parseBilingualText('Para cambios o cancelaciones, contacta a nuestro equipo al menos 24 horas antes del check-in. / For changes or cancellations, contact our team at least 24 hours before check-in.', language)}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RefundPoliciesSection;
