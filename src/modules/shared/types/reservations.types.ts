// Shared Reservation Types - Base types for forms

import { GuestInfo } from './api.types';

/**
 * Base form data structure for reservations
 * Shared between admin and client forms
 */
export interface ReservationFormDataBase {
  roomId: number | null;
  checkIn: Date | null;
  checkOut: Date | null;
  checkInTime?: string;
  checkOutTime?: string;
  guestFirstName: string;
  guestLastName: string | undefined;
  guestEmail: string | undefined;
  guestPhone: string | undefined;
  guestSex: 'M' | 'F' | 'otro' | undefined;
  guestIdNumber: string | undefined;
  baseGuestsCount: number;
  extraGuestsCount: number;
  totalGuests: number;
  additionalGuests: GuestInfo[];
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  transferOneWay: boolean;
  transferRoundTrip: boolean;
  breakfasts: number;
  notes: string;
}

/**
 * Client reservation form data
 * Same as base but for client-side booking
 */
export type ClientReservationFormData = ReservationFormDataBase;
