import type { Room } from '@/modules/shared/types/api.types';
import type { useClientReservation } from '@/modules/client/hooks/useClientReservation';

// Main hook type
export type ReservationHook = ReturnType<typeof useClientReservation>;

// Props principales
export interface ReservationFormProps {
  hook: ReservationHook;
  rooms: Room[];
  loadingRooms?: boolean;
  singleRoomId?: number;
}

// Precios
export interface PricesData {
  earlyCheckInPrice: number;
  lateCheckOutPrice: number;
  transferOneWayPrice: number;
  transferRoundTripPrice: number;
  breakfastPrice: number;
}

// Desglose de costos
export interface ReservationBreakdown {
  baseTotal?: number;
  breakfastsCost?: number;
  earlyCheckInCost?: number;
  lateCheckOutCost?: number;
  transferOneWayCost?: number;
  transferReturnCost?: number;
}

// Guest individual
export interface Guest {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro';
}

// Props de componentes de formulario comunes
export interface FormFieldProps {
  validationErrors?: string[];
  disabled?: boolean;
}

// Estado de pago
export type PaymentMethod = 'stripe' | 'paypal' | 'zelle' | 'bizum';

// Props componentes de pago
export interface PaymentStepProps {
  totalPrice: number;
  submitting?: boolean;
  onBack?: () => void;
  onConfirm?: () => void;
}

// Props de confirmación
export interface ConfirmationStepProps {
  hook: ReservationHook;
  selectedRoom: Room | undefined;
  nights: number;
  totalPrice: number;
  confirmationId?: string;
}

