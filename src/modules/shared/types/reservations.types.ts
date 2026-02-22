// Shared Reservation Form Types

import { GuestInfo } from '@/modules/shared/types/api.types';

/**
 * Base form data structure for reservations (common fields for admin and client)
 */
export interface ReservationFormDataBase {
  roomId: number | null;
  guestFirstName: string;
  guestLastName: string;
  guestSex: 'M' | 'F' | 'O';
  guestEmail: string;
  guestPhone: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  totalGuests: number;
  baseGuestsCount: number;
  extraGuestsCount: number;
  additionalGuests: GuestInfo[];
  notes: string;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
}

/**
 * Client reservation form data (same as base, no status)
 */
export type ClientReservationFormData = ReservationFormDataBase;
