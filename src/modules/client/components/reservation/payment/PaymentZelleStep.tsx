import { Button } from '@/modules/shared/components/ui/button';

interface PaymentZelleStepProps {
  totalPrice: number;
  onConfirm: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function PaymentZelleStep({
  totalPrice,
  onConfirm,
  onBack,
  submitting,
}: PaymentZelleStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-center">Pago con Zelle</h1>
        <p className="text-muted-foreground text-center">
          Total a pagar: <span className="font-bold text-primary text-2xl">${totalPrice}</span>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Información de la Cuenta</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email Zelle:</p>
            <p className="font-bold text-lg">luislo2456@gmail.com</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nombre del titular:</p>
            <p className="font-bold text-lg">Luis Manuel López González</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monto a transferir:</p>
            <p className="font-bold text-lg text-primary">${totalPrice}</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Instrucciones:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Abre tu aplicación bancaria o Zelle</li>
          <li>Envía una transferencia a <strong>luislo2456@gmail.com</strong></li>
          <li>Importe <strong>${totalPrice}</strong></li>
          <li>Haz clic en el botón "Confirmar Pago" abajo</li>
        </ol>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold">Recuerda:</p>
        <p className="text-sm text-muted-foreground">
          Recibirás un email de confirmación en menos de 24 horas. Si no lo recibes, contacta a nuestro equipo en los teléfonos del hostal.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← Atrás
        </Button>
        <Button onClick={onConfirm} disabled={submitting} className="flex-1 font-semibold">
          {submitting ? 'Procesando...' : 'Confirmar Pago'}
        </Button>
      </div>
    </div>
  );
}

