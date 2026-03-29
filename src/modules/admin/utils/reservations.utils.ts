// Admin Reservations Utils - Transformation and validation functions

import { format, setHours, setMinutes } from 'date-fns';
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
    checkInTime: '',
    checkOutTime: '',
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
    guestIdNumber: '',
    checkIn: undefined,
    checkOut: undefined,
    checkInTime: '',
    checkOutTime: '',
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
export function normalizeReservation(reservation: unknown): ReservationWithDetails {
  const r = reservation as Record<string, unknown>;

  // Extract client safely
  const clientRaw = r['client'];
  const client = clientRaw && typeof clientRaw === 'object' ? (clientRaw as Record<string, unknown>) : undefined;

  const mainGuest = {
    firstName: client && typeof client['firstName'] === 'string' ? (client['firstName'] as string) : '',
    lastName: client && typeof client['lastName'] === 'string' ? (client['lastName'] as string) : '',
    sex: client && typeof client['sex'] === 'string' ? (client['sex'] as 'M' | 'F' | 'otro') : 'M',
    email: client && typeof client['email'] === 'string' ? (client['email'] as string) : '',
    phone: client && typeof client['phone'] === 'string' ? (client['phone'] as string) : '',
  };

  return {
    // spread any other properties returned by the backend
    ...(r as Record<string, unknown>),
    mainGuest,
    checkInDate: (r['checkInDate'] as string) || '',
    checkOutDate: (r['checkOutDate'] as string) || '',
    baseGuestsCount: (r['baseGuestsCount'] as number) || 0,
    extraGuestsCount: (r['extraGuestsCount'] as number) || 0,
    totalPrice: (r['totalPrice'] as number) || 0,
    notes: (r['notes'] as string) || '',
    earlyCheckIn: (r['earlyCheckIn'] as boolean) || false,
    lateCheckOut: (r['lateCheckOut'] as boolean) || false,
    additionalGuests: Array.isArray(r['additionalGuests']) ? (r['additionalGuests'] as unknown[]) : [],
  } as ReservationWithDetails;
}

/**
 * Convert Reservation to FormData for editing
 */
export function reservationToFormData(
  reservation: ReservationWithDetails
): ReservationFormData {
  const inDate = reservation.checkInDate ? new Date(reservation.checkInDate) : undefined;
  const outDate = reservation.checkOutDate ? new Date(reservation.checkOutDate) : undefined;

  return {
    roomId: reservation.roomId,
    guestFirstName: reservation.mainGuest.firstName,
    guestLastName: reservation.mainGuest.lastName,
    guestSex: reservation.mainGuest.sex,
    guestEmail: reservation.mainGuest.email,
    guestPhone: reservation.mainGuest.phone || '',
    checkIn: inDate,
    checkOut: outDate,
    checkInTime: inDate ? format(inDate, 'HH:mm') : '',
    checkOutTime: outDate ? format(outDate, 'HH:mm') : '',
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

  // Determine check-in time: prefer explicit form time, fallback to 16:00
  let checkInDateTime = formData.checkIn;
  if (formData.checkInTime) {
    const [h, m] = formData.checkInTime.split(':').map(v => parseInt(v, 10));
    checkInDateTime = setMinutes(setHours(formData.checkIn, isNaN(h) ? 16 : h), isNaN(m) ? 0 : m);
  } else {
    checkInDateTime = setMinutes(setHours(formData.checkIn, 16), 0);
  }

  // Determine check-out time: prefer explicit form time, fallback to 12:00
  let checkOutDateTime = formData.checkOut;
  if (formData.checkOutTime) {
    const [h, m] = formData.checkOutTime.split(':').map(v => parseInt(v, 10));
    checkOutDateTime = setMinutes(setHours(formData.checkOut, isNaN(h) ? 12 : h), isNaN(m) ? 0 : m);
  } else {
    checkOutDateTime = setMinutes(setHours(formData.checkOut, 12), 0);
  }

  return {
    roomId: formData.roomId,
    checkInDate: format(checkInDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
    checkOutDate: format(checkOutDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
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
  formData: ClientReservationFormData,
  paymentMethod?: 'paypal' | 'stripe' | 'zelle' | 'bizum',
  stripeCustomerId?: string
): CreateReservationDto {
  if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
    throw new Error('Missing required fields');
  }

  // Determine check-in/out times for client: prefer explicit, fall back to defaults
  let checkInDateTime = formData.checkIn;
  if (formData.checkInTime) {
    const [h, m] = formData.checkInTime.split(':').map(v => parseInt(v, 10));
    checkInDateTime = setMinutes(setHours(formData.checkIn, isNaN(h) ? 16 : h), isNaN(m) ? 0 : m);
  } else {
    checkInDateTime = setMinutes(setHours(formData.checkIn, 16), 0);
  }

  let checkOutDateTime = formData.checkOut;
  if (formData.checkOutTime) {
    const [h, m] = formData.checkOutTime.split(':').map(v => parseInt(v, 10));
    checkOutDateTime = setMinutes(setHours(formData.checkOut, isNaN(h) ? 12 : h), isNaN(m) ? 0 : m);
  } else {
    checkOutDateTime = setMinutes(setHours(formData.checkOut, 12), 0);
  }

  return {
    roomId: formData.roomId,
    checkInDate: format(checkInDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
    checkOutDate: format(checkOutDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
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
    paymentMethod,
    stripeCustomerId,
    paymentType: 'reservation',
    currency: 'usd',
  };
}

/**
 * Convert FormData to UpdateReservationDto
 */
export function formDataToUpdateDto(
  formData: ReservationFormData
): UpdateReservationDto {
  // If explicit times present, use them; otherwise fall back to defaults as before
  const checkInDate = formData.checkIn
    ? (formData.checkInTime ? format(setMinutes(setHours(formData.checkIn, parseInt(formData.checkInTime.split(':')[0] || '16', 10)), parseInt(formData.checkInTime.split(':')[1] || '0', 10)), "yyyy-MM-dd'T'HH:mm:ss") : format(setMinutes(setHours(formData.checkIn, 16), 0), "yyyy-MM-dd'T'HH:mm:ss"))
    : undefined;
  const checkOutDate = formData.checkOut
    ? (formData.checkOutTime ? format(setMinutes(setHours(formData.checkOut, parseInt(formData.checkOutTime.split(':')[0] || '12', 10)), parseInt(formData.checkOutTime.split(':')[1] || '0', 10)), "yyyy-MM-dd'T'HH:mm:ss") : format(setMinutes(setHours(formData.checkOut, 12), 0), "yyyy-MM-dd'T'HH:mm:ss"))
    : undefined;

  return {
    status: formData.status,
    notes: formData.notes.trim() || undefined,
    checkInDate,
    checkOutDate,
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
