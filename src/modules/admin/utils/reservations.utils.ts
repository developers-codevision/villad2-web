// Admin Reservations Utils - Transformation and validation functions

import { format } from 'date-fns';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationStatus,
} from '@/modules/shared/types/api.types';
import {
  ReservationFormData,
  ReservationWithDetails,
} from '../types/reservations.types';
import { ClientReservationFormData } from '@/modules/shared/types/reservations.types';

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
    transferOneWay: false,
    transferRoundTrip: false,
    breakfasts: 0,
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
    transferOneWay: false,
    transferRoundTrip: false,
    breakfasts: 0,
  };
}

// ============================================
// FORM TRANSFORMATIONS
// ============================================

/**
 * Normalize reservation data from backend
 * Handles both old and new formats
 */
export function normalizeReservation(reservation: Record<string, unknown>): ReservationWithDetails {
  // Nuevo formato: siempre hay client
  return {
    ...reservation,
    mainGuest: {
      firstName: (reservation.client as any).firstName,
      lastName: (reservation.client as any).lastName,
      sex: (reservation.client as any).sex,
      email: (reservation.client as any).email,
      phone: (reservation.client as any).phone,
    },
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
    baseGuestsCount: reservation.baseGuestsCount,
    extraGuestsCount: reservation.extraGuestsCount,
    totalPrice: reservation.totalPrice,
    notes: reservation.notes || '',
    earlyCheckIn: reservation.earlyCheckIn,
    lateCheckOut: reservation.lateCheckOut,
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
    transferOneWay: reservation.transferOneWay || false,
    transferRoundTrip: reservation.transferRoundTrip || false,
    breakfasts: reservation.breakfasts || 0,
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
    status: formData.status,
    notes: formData.notes.trim() || undefined,
    additionalGuests: formData.additionalGuests.length > 0 ? formData.additionalGuests : undefined,
    earlyCheckIn: formData.earlyCheckIn,
    lateCheckOut: formData.lateCheckOut,
    transferOneWay: formData.transferOneWay,
    transferRoundTrip: formData.transferRoundTrip,
    breakfasts: formData.breakfasts || undefined,
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
    transferOneWay: formData.transferOneWay,
    transferRoundTrip: formData.transferRoundTrip,
    breakfasts: formData.breakfasts || undefined,
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
    transferOneWay: formData.transferOneWay,
    transferRoundTrip: formData.transferRoundTrip,
    breakfasts: formData.breakfasts || undefined,
  };
}

export { validateReservationForm } from '@/modules/shared/validations/reservations.validation';
