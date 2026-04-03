/**
 * Helpers para lógica de steps y validación del flujo
 */
import type { ReservationHook } from '../types';

/**
 * Determina si estamos en una etapa de pago
 */
export const isPaymentStep = (step: string): boolean => {
  return ['payment', 'payment-zelle', 'payment-bizum'].includes(step);
};

/**
 * Determina si el componente debe mostrar el formulario principal
 */
export const shouldShowMainForm = (step: string): boolean => {
  return !['payment', 'payment-zelle', 'payment-bizum'].includes(step);
};

/**
 * Valida que hay datos básicos necesarios
 */
export const hasBasicReservationData = (
  roomId: number | undefined,
  checkIn: Date | null,
  checkOut: Date | null,
  totalGuests: number
): boolean => {
  return (
    roomId !== undefined &&
    checkIn !== null &&
    checkOut !== null &&
    totalGuests > 0
  );
};

