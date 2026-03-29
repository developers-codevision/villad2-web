import { CheckCircle } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Room } from '@/modules/shared/types/api.types';
import type { ReservationHook } from '../types';

interface ConfirmationStepProps {
  hook: ReservationHook;
  selectedRoom: Room | undefined;
  nights: number;
  totalPrice: number;
}

export default function ConfirmationStep({
  hook,
  selectedRoom,
  nights,
  totalPrice,
}: ConfirmationStepProps) {
  const { formData, confirmationId, resetForm } = hook;

  return (
    <div className="text-center max-w-md mx-auto">
      <CheckCircle size={64} className="text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">¡Reserva Solicitada!</h1>
      <p className="text-muted-foreground mb-2">
        Gracias, <strong>{formData.guestFirstName} {formData.guestLastName}</strong>. Tu solicitud de reserva ha sido registrada.
      </p>
      {confirmationId && (
        <p className="text-sm text-muted-foreground mb-4">
          Número de confirmación: <strong>#{confirmationId}</strong>
        </p>
      )}
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <p className="font-semibold mb-2">{selectedRoom?.name}</p>
        <p className="text-sm text-muted-foreground mb-2">
          {formData.checkIn && format(formData.checkIn, "dd MMM yyyy", { locale: es })} — {formData.checkOut && format(formData.checkOut, "dd MMM yyyy", { locale: es })}
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          {nights} {nights === 1 ? "noche" : "noches"} · {formData.totalGuests} {formData.totalGuests === 1 ? "huésped" : "huéspedes"}
        </p>
        {formData.extraGuestsCount > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            Incluye {formData.extraGuestsCount} huésped{formData.extraGuestsCount === 1 ? '' : 'es'} adicional{formData.extraGuestsCount === 1 ? '' : 'es'}
          </p>
        )}
        <p className="text-2xl font-bold text-primary mt-2">${totalPrice}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        Tu reserva está <strong>pendiente de confirmación</strong>.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Recibirás un email en <strong>{formData.guestEmail}</strong> cuando sea confirmada por el administrador.
      </p>
      <Button className="font-semibold" onClick={resetForm}>
        Nueva Reserva
      </Button>
    </div>
  );
}

