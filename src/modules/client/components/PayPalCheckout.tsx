import React, { useMemo, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import type { Room } from '@/modules/shared/types/api.types';
import type { ReservationHook } from './ReservationForm';
import { clientFormDataToCreateDto } from '@/modules/admin/utils/reservations.utils';

interface Props {
  hook: any; // useClientReservation return type (loosely-typed to avoid circular imports)
  room?: Room | undefined;
}

export default function PayPalCheckout({ hook, room }: Props) {
  const { formData, reservationSummary, finalizeReservationAfterPayment } = hook;
  const { nights, totalPrice } = reservationSummary(room);
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

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="w-full">
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', color: 'gold', label: 'paypal' }}
          createOrder={async () => {
            try {
              setLoading(true);

              // Build the same DTO that Stripe flow uses
              const createDto = clientFormDataToCreateDto(formData as any);
              console.log(createDto)
              // Send the full reservation DTO to the backend endpoint that creates both reservation and PayPal order
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
              // backend returns { success: true, data: { orderId } }
              const orderId = data?.data?.orderId || data?.orderId;
              if (!orderId) throw new Error('No order id returned from server');
              return orderId;
            } catch (error: any) {
              console.error('createOrder error', error);
              toast.error('No se pudo iniciar el pago con PayPal');
              throw error;
            } finally {
              setLoading(false);
            }
          }}
          onApprove={async (data, actions) => {
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

              // The backend should create/return the reservation id or payment record id.
              // Try to read reservation id from response.
              const reservationId = captureResult?.data?.reservationId || captureResult?.reservationId || captureResult?.data?.paypalPayment?.reservationId;

              toast.success('Pago realizado correctamente');

              if (reservationId) {
                finalizeReservationAfterPayment(Number(reservationId), 'paypal');
              } else {
                // fallback: just go to confirmation without reservation id
                finalizeReservationAfterPayment(-1, 'paypal');
              }
            } catch (error) {
              console.error('onApprove error', error);
              toast.error('No se pudo completar el pago.');
            } finally {
              setLoading(false);
            }
          }}
          onError={(err) => {
            console.error('PayPal Buttons error', err);
            toast.error('Error en PayPal. Por favor intenta de nuevo.');
          }}
        />
        {loading && <p className="text-sm text-muted-foreground mt-2">Procesando pago...</p>}
      </div>
    </PayPalScriptProvider>
  );
}
