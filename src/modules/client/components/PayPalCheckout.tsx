import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Room } from '@/modules/shared/types/api.types';
import type { useClientReservation } from '@/modules/client/hooks/useClientReservation';
import { clientFormDataToCreateDto } from '@/modules/admin/utils/reservations.utils';
import type { CreateReservationDto } from '@/modules/shared/types/api.types';

interface Props {
  hook: ReturnType<typeof useClientReservation>;
  room?: Room | undefined;
}

type PayPalButtonsActions = {
  order: {
    capture: () => Promise<unknown>;
  };
};

type PayPalButtonCreateOrderData = Record<string, unknown>;
type PayPalButtonApproveData = { orderID?: string };
type PayPalButtonCancelData = Record<string, unknown>;

type PayPalButtonsConfig = {
  style?: Record<string, string>;
  createOrder: (data: PayPalButtonCreateOrderData, actions: PayPalButtonsActions) => Promise<string>;
  onApprove: (data: PayPalButtonApproveData, actions: PayPalButtonsActions) => Promise<void>;
  onCancel?: (data: PayPalButtonCancelData) => void;
  onError?: (error: unknown) => void;
};

type PayPalGlobal = {
  Buttons: (config: PayPalButtonsConfig) => {
    render: (container: HTMLElement) => Promise<void>;
    close: () => void;
  };
};

declare global {
  interface Window {
    paypal?: PayPalGlobal;
  }
}

const SCRIPT_ID = 'paypal-js-sdk';

async function loadPayPalSdk(clientId: string, currency: string): Promise<PayPalGlobal> {
  if (window.paypal) return window.paypal;

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      if (window.paypal) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load')), { once: true });
    });
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    return window.paypal;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.head.appendChild(script);
  });

  if (!window.paypal) throw new Error('PayPal SDK unavailable after load');
  return window.paypal;
}

export default function PayPalCheckout({ hook, room }: Props) {
  const { formData, reservationSummary, finalizeReservationAfterPayment, previousStep } = hook;
  const { totalPrice } = reservationSummary(room);
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID ;
  const currency = 'USD';
  const apiUrl = import.meta.env.VITE_API_URL;

  const createDto = useMemo(
    () => clientFormDataToCreateDto(formData, 'paypal'),
    [formData]
  );

  useEffect(() => {
    let cancelled = false;

    const initSdk = async () => {
      try {
        await loadPayPalSdk(clientId, currency);
        if (!cancelled) setSdkReady(true);
      } catch (error) {
        console.error('PayPal SDK load error', error);
        if (!cancelled) {
          toast.error('No se pudo cargar PayPal. Intenta de nuevo más tarde.');
          setSdkReady(false);
        }
      }
    };

    initSdk();
    return () => {
      cancelled = true;
    };
  }, [clientId, currency]);

  useEffect(() => {
    if (!room || !sdkReady || !containerRef.current || !window.paypal) return;

    const instance = window.paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect', color: 'gold', label: 'paypal' },
      createOrder: async () => {
        try {
          setLoading(true);
          const res = await fetch(`${apiUrl}/reservations/with-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createDto),
          });

          if (!res.ok) {
            const errBody = await res.json().catch(() => null);
            const errMsg = errBody?.message || errBody?.error || 'Error al procesar la reserva';
            toast.error(`No se pudo generar la reserva: ${errMsg}`);
            throw new Error(errMsg);
          }

          const data = await res.json();
          const orderId = data?.paypalOrder?.orderId || data?.data?.orderId || data?.orderId;
          if (!orderId) {
            toast.error('Respuesta inválida del servidor al crear el pago.');
            throw new Error('No order id returned from server');
          }
          return orderId;
        } catch (error) {
          console.error('createOrder error', error);
          toast.error('Error de conexión o validación. Intenta nuevamente.');
          // setTimeout(() => {
          //   window.location.href = '/';
          // }, 2000);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      onApprove: async (data: PayPalButtonApproveData) => {
        try {
          if (!data.orderID) {
            toast.error('Error interno de PayPal.');
            throw new Error('Missing PayPal order ID');
          }

          setLoading(true);
          const res = await fetch(`${apiUrl}/paypal/capture-payment/${data.orderID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            const errBody = await res.json().catch(() => null);
            const errMsg = errBody?.message || errBody?.error || 'Error al capturar el pago';
            throw new Error(errMsg);
          }

          const captureResult = await res.json();
          const reservationId =
            captureResult?.data?.reservationId ||
            captureResult?.reservationId ||
            captureResult?.data?.paypalPayment?.reservationId;

          toast.success('Pago realizado correctamente');
          finalizeReservationAfterPayment(reservationId ? Number(reservationId) : -1, 'paypal');
        } catch (error) {
          console.error('onApprove error', error);
          toast.error('Hubo un problema confirmando el pago. Revise su conexión a internet . Serás redirigido al inicio.');
          setTimeout(() => {
           // window.location.href = '/';
           }, 2500);
        } finally {
          setLoading(false);
        }
      },
      onCancel: (data: PayPalButtonCancelData) => {
        console.warn('PayPal checkout cancelled', data);
        toast.error('El pago fue cancelado. Redirigiendo...');
         setTimeout(() => {
           window.location.href = '/';
         }, 1500);
      },
      onError: (err: unknown) => {
        console.error('PayPal Buttons error', err);
        toast.error('Ocurrió un error inesperado con PayPal. Revise su conexión a internet . Redirigiendo...');
        setTimeout(() => {
        //window.location.href = '/';
         }, 2000);
      },
    });

    void instance.render(containerRef.current);

    return () => {
      instance.close();
    };
  }, [apiUrl, createDto, finalizeReservationAfterPayment, previousStep, room, sdkReady]);

  if (!room) return null;

  return (
    <div className="w-full">
      {!sdkReady && <p className="text-sm text-muted-foreground">Cargando PayPal...</p>}
      <div ref={containerRef} />
      {loading && <p className="text-sm text-muted-foreground mt-2">Procesando pago...</p>}
      <p className="text-xs text-muted-foreground mt-2">Total: ${totalPrice}</p>
    </div>
  );
}