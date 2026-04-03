import { CheckCircle } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Room } from '@/modules/shared/types/api.types';
import type { ReservationHook } from '../types';
import { useLanguage } from '@/modules/client/contexts';

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
  const { t } = useLanguage();

  return (
    <div className="text-center max-w-md mx-auto">
      <CheckCircle size={64} className="text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">{t("reservation.reservationRequested")}</h1>
      <p className="text-muted-foreground mb-2">
        {t("reservation.thankYou")} <strong>{formData.guestFirstName} {formData.guestLastName}</strong>. {t("reservation.requestRegistered")}
      </p>
      {confirmationId && (
        <p className="text-sm text-muted-foreground mb-4">
          {t("reservation.confirmationNumber")}: <strong>#{confirmationId}</strong>
        </p>
      )}
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <p className="font-semibold mb-2">{selectedRoom?.name}</p>
        <p className="text-sm text-muted-foreground mb-2">
          {formData.checkIn && format(formData.checkIn, "dd MMM yyyy", { locale: es })} — {formData.checkOut && format(formData.checkOut, "dd MMM yyyy", { locale: es })}
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          {nights} {nights === 1 ? t("reservation.nightSingular") : t("reservation.nightPlural")} · {formData.totalGuests} {formData.totalGuests === 1 ? t("reservation.guestSingular") : t("reservation.guestPlural")}
        </p>
        {formData.extraGuestsCount > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            {t("reservation.includes")} {formData.extraGuestsCount} {t("reservation.additionalGuest")}
          </p>
        )}
        <p className="text-2xl font-bold text-primary mt-2">${totalPrice}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {t("reservation.reservationStatus")} <strong>{t("reservation.pendingConfirmation")}</strong>.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        {t("reservation.confirmationEmailSent")} <strong>{formData.guestEmail}</strong> {t("reservation.whenConfirmedByAdmin")}
      </p>
      <Button className="font-semibold" onClick={resetForm}>
        {t("reservation.newReservation")}
      </Button>
    </div>
  );
}

