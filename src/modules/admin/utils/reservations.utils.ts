// Admin Reservations Utils - Transformation and validation functions

import { format } from 'date-fns';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationStatus,
} from '@/modules/shared/types/api.types';
import type { ClientReservationFormData } from '@/modules/shared/types/reservations.types';
import {
  ReservationFormData,
  ReservationWithDetails,
} from '../types/reservations.types';

// ============================================
// FORM INITIALIZATION
// ============================================

/**
 * Create empty form data for new reservation
 */
export function createEmptyReservationForm(): ReservationFormData {
  return {
    roomId: null,
    guestFirstName: '',
    guestLastName: '',
    guestSex: 'M',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    totalGuests: 1,
    baseGuestsCount: 1,
    extraGuestsCount: 0,
    additionalGuests: [],
    notes: '',
    status: ReservationStatus.PENDING,
    earlyCheckIn: false,
    lateCheckOut: false,
  };
}

/**
 * Create empty client reservation form
 */
export function createEmptyClientReservationForm(): ClientReservationFormData {
  return {
    roomId: null,
    guestFirstName: '',
    guestLastName: '',
    guestSex: 'M',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    totalGuests: 1,
    baseGuestsCount: 1,
    extraGuestsCount: 0,
    additionalGuests: [],
    notes: '',
    earlyCheckIn: false,
    lateCheckOut: false,
  };
}

// ============================================
// FORM TRANSFORMATIONS
// ============================================

/**
 * Normalize reservation data from backend
 * Handles both old and new formats
 */
export function normalizeReservation(reservation: any): ReservationWithDetails {
  // If already has mainGuest, return as is
  if (reservation.mainGuest) {
    return reservation as ReservationWithDetails;
  }

  // Transform old format to new format
  const guestName = reservation.guestName || '';
  const nameParts = guestName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    ...reservation,
    mainGuest: {
      firstName: firstName,
      lastName: lastName,
      sex: reservation.guestSex || 'M',
      email: reservation.guestEmail || '',
      phone: reservation.guestPhone || '',
    },
    checkInDate: reservation.checkInDate || reservation.checkIn,
    checkOutDate: reservation.checkOutDate || reservation.checkOut,
    baseGuestsCount: reservation.baseGuestsCount || reservation.guests || 1,
    extraGuestsCount: reservation.extraGuestsCount || 0,
    totalPrice: reservation.totalPrice || 0,
    notes: reservation.notes || reservation.specialRequests || '',
    earlyCheckIn: reservation.earlyCheckIn || false,
    lateCheckOut: reservation.lateCheckOut || false,
    additionalGuests: reservation.additionalGuests || [],
  } as ReservationWithDetails;
}

/**
 * Convert Reservation to FormData for editing
 */
export function reservationToFormData(
  reservation: ReservationWithDetails
): ReservationFormData {
  return {
    roomId: reservation.roomId,
    guestFirstName: reservation.mainGuest.firstName,
    guestLastName: reservation.mainGuest.lastName,
    guestSex: reservation.mainGuest.sex,
    guestEmail: reservation.mainGuest.email,
    guestPhone: reservation.mainGuest.phone || '',
    checkIn: new Date(reservation.checkInDate),
    checkOut: new Date(reservation.checkOutDate),
    totalGuests: reservation.baseGuestsCount + reservation.extraGuestsCount,
    baseGuestsCount: reservation.baseGuestsCount,
    extraGuestsCount: reservation.extraGuestsCount,
    additionalGuests: reservation.additionalGuests || [],
    notes: reservation.notes || '',
    status: reservation.status,
    earlyCheckIn: reservation.earlyCheckIn,
    lateCheckOut: reservation.lateCheckOut,
  };
}

/**
 * Convert FormData to CreateReservationDto
 */
export function formDataToCreateDto(
  formData: ReservationFormData
): CreateReservationDto {
  if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
    throw new Error('Missing required fields');
  }

  return {
    roomId: formData.roomId,
    checkInDate: format(formData.checkIn, 'yyyy-MM-dd'),
    checkOutDate: format(formData.checkOut, 'yyyy-MM-dd'),
    mainGuest: {
      firstName: formData.guestFirstName.trim(),
      lastName: formData.guestLastName.trim(),
      sex: formData.guestSex,
      email: formData.guestEmail.trim(),
      phone: formData.guestPhone.trim(),
    },
    baseGuestsCount: formData.baseGuestsCount,
    extraGuestsCount: formData.extraGuestsCount,
    status: ReservationStatus.CONFIRMED, // Admin siempre crea confirmada
    notes: formData.notes.trim() || undefined,
    additionalGuests: formData.additionalGuests.length > 0 ? formData.additionalGuests : undefined,
    earlyCheckIn: formData.earlyCheckIn,
    lateCheckOut: formData.lateCheckOut,
  };
}

/**
 * Convert ClientFormData to CreateReservationDto
 */
export function clientFormDataToCreateDto(
  formData: ClientReservationFormData
): CreateReservationDto {
  if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
    throw new Error('Missing required fields');
  }

  return {
    roomId: formData.roomId,
    checkInDate: format(formData.checkIn, 'yyyy-MM-dd'),
    checkOutDate: format(formData.checkOut, 'yyyy-MM-dd'),
    mainGuest: {
      firstName: formData.guestFirstName.trim(),
      lastName: formData.guestLastName.trim(),
      sex: formData.guestSex,
      email: formData.guestEmail.trim(),
      phone: formData.guestPhone.trim(),
    },
    baseGuestsCount: formData.baseGuestsCount,
    extraGuestsCount: formData.extraGuestsCount,
    status: ReservationStatus.PENDING, // Client always creates pending
    notes: formData.notes.trim() || undefined,
    // Send all non-principal guests regardless of base/extra distinction
    additionalGuests: formData.additionalGuests.length > 0 ? formData.additionalGuests : undefined,
    earlyCheckIn: formData.earlyCheckIn,
    lateCheckOut: formData.lateCheckOut,
  };
}

/**
 * Convert FormData to UpdateReservationDto
 */
export function formDataToUpdateDto(
  formData: ReservationFormData
): UpdateReservationDto {
  return {
    status: formData.status,
    notes: formData.notes.trim() || undefined,
    checkInDate: formData.checkIn ? format(formData.checkIn, 'yyyy-MM-dd') : undefined,
    checkOutDate: formData.checkOut ? format(formData.checkOut, 'yyyy-MM-dd') : undefined,
    baseGuestsCount: formData.baseGuestsCount,
    extraGuestsCount: formData.extraGuestsCount,
    earlyCheckIn: formData.earlyCheckIn,
    lateCheckOut: formData.lateCheckOut,
  };
}

export { validateReservationForm } from '@/modules/shared/validations/reservations.validation';
