import { AlertCircle, CheckCircle } from 'lucide-react';

const RefundPoliciesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Políticas de <span className="text-primary">Reembolsos</span>
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Queremos que viajes con confianza. Conoce nuestras políticas flexibles de cancelación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cancelación con tiempo */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <CheckCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">Cancelación con Tiempo</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Si cancelas con más de 14 días antes de la fecha de check-in:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                100% del monto será reembolsado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Sin penalizaciones adicionales
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Procesamiento en 5-7 días hábiles
              </li>
            </ul>
          </div>

          {/* Cancelación últimos días */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">Cancelación Tardía</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Si cancelas con menos de 14 días antes de la fecha de check-in:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Se retiene el 50% del monto de la reserva
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                El 50% restante se reembolsa
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Procesamiento en 10 días hábiles
              </li>
            </ul>
          </div>

          {/* No-show */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">No-Show</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Si no llegas a la fecha de check-in sin aviso previo:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Se cobra el 100% del monto de la reserva
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                No se realiza reembolso alguno
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Te recomendamos comunicarte con nosotros
              </li>
            </ul>
          </div>

          {/* Modificaciones */}
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <CheckCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold">Modificaciones</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Puedes modificar tu reserva en cualquier momento:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Cambiar fechas sin cargo adicional
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Diferencia de precio se ajusta automáticamente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Solo se requiere confirmación
              </li>
            </ul>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4">Información Importante</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Los reembolsos se procesan al método de pago original utilizado.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Algunos bancos pueden tardar hasta 7 días adicionales en reflejar el reembolso en tu cuenta.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Los impuestos y tasas no son reembolsables según la legislación local.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Para cambios o cancelaciones, contacta a nuestro equipo al menos 24 horas antes del check-in.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RefundPoliciesSection;
