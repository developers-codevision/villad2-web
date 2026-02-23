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
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  guestSex: 'M' | 'F' | 'otro';
  baseGuestsCount: number;
  extraGuestsCount: number;
  totalGuests: number;
  additionalGuests: GuestInfo[];
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  notes: string;
}

/**
 * Client reservation form data
 * Same as base but for client-side booking
 */
export interface ClientReservationFormData extends ReservationFormDataBase {}
