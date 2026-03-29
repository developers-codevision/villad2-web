import type { Room } from '@/modules/shared/types/api.types';
import type { useClientReservation } from '@/modules/client/hooks/useClientReservation';

export type ReservationHook = ReturnType<typeof useClientReservation>;

export interface ReservationFormProps {
  hook: ReservationHook;
  rooms: Room[];
  loadingRooms?: boolean;
  singleRoomId?: number;
}

export interface PricesData {
  earlyCheckInPrice: number;
  lateCheckOutPrice: number;
  transferOneWayPrice: number;
  transferRoundTripPrice: number;
  breakfastPrice: number;
}

export interface ReservationBreakdown {
  baseTotal?: number;
  breakfastsCost?: number;
  earlyCheckInCost?: number;
  lateCheckOutCost?: number;
  transferOneWayCost?: number;
  transferReturnCost?: number;
}

