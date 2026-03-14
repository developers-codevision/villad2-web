import React, { useMemo, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import type { Room } from '@/modules/shared/types/api.types';
import type { useClientReservation } from '@/modules/client/hooks/useClientReservation';
import { clientFormDataToCreateDto } from '@/modules/admin/utils/reservations.utils';
import type { CreateReservationDto } from '@/modules/shared/dtos/reservation.dto';

interface Props {
  hook: ReturnType<typeof useClientReservation>;
  room?: Room | undefined;
}

export default function PayPalCheckout({ hook, room }: Props) {
  const { formData, reservationSummary, finalizeReservationAfterPayment, previousStep } = hook;
  const { totalPrice } = reservationSummary(room);
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
  const currency = 'USD';

  const initialOptions = useMemo(() => ({
    'client-id': clientId,
    currency,
    intent: 'capture',
    components: 'buttons',
  }), [clientId]);

  if (!room) return null;

  const handleGoBack = () => {
    previousStep();
    window.location.reload();
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="w-full">
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', color: 'gold', label: 'paypal' }}
          createOrder={async () => {
            try {
              setLoading(true);

              const createDto = clientFormDataToCreateDto(formData as CreateReservationDto);
              console.log(createDto)
              const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/paypal/create-order-with-reservation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createDto),
              });

              if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Failed to create order');
              }

              const data = await res.json();
              const orderId = data?.data?.orderId || data?.orderId;
              if (!orderId) throw new Error('No order id returned from server');
              return orderId;
            } catch (error) {
              console.error('createOrder error', error);
              toast.error('No se pudo iniciar el pago con PayPal');
              throw error;
            } finally {
              setLoading(false);
            }
          }}
          onApprove={async (data) => {
            try {
              setLoading(true);
              const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/paypal/capture-payment/${data.orderID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });

              if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Failed to capture payment');
              }

              const captureResult = await res.json();
              const reservationId = captureResult?.data?.reservationId || captureResult?.reservationId || captureResult?.data?.paypalPayment?.reservationId;

              toast.success('Pago realizado correctamente');

              if (reservationId) {
                finalizeReservationAfterPayment(Number(reservationId), 'paypal');
              } else {
                finalizeReservationAfterPayment(-1, 'paypal');
              }
            } catch (error) {
              console.error('onApprove error', error);
              toast.error('No se pudo completar el pago.');
            } finally {
              setLoading(false);
            }
          }}
           onCancel={async (data) => {
            try {
              setLoading(false);
              console.warn('PayPal checkout cancelled', data);
              toast('El pago fue cancelado.');
              handleGoBack();
            } catch (error) {
              console.error('onCancel error', error);
              toast.error('No se pudo procesar la cancelación.');
            } finally {
              setLoading(false);
            }
          }}
          onError={(err) => {
            console.error('PayPal Buttons error', err);
            toast.error('Error en PayPal. Por favor intenta de nuevo.');
            handleGoBack();
          }}
        />
        {loading && <p className="text-sm text-muted-foreground mt-2">Procesando pago...</p>}
      </div>
    </PayPalScriptProvider>
  );
}