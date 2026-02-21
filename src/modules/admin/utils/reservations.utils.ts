// Admin Reservations Utils - Transformation and validation functions

import { format, differenceInDays } from 'date-fns';
import {
  Reservation,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationStatus,
} from '@/modules/shared/types/api.types';
import {
  ReservationFormData,
  ReservationWithDetails,
  ClientReservationFormData,
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
    status: formData.status,
    notes: formData.notes.trim() || undefined,
    additionalGuests: formData.additionalGuests,
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

// ============================================
// VALIDATION
// ============================================

/**
 * Validate reservation form data
 */
export function validateReservationForm(
  formData: ReservationFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!formData.roomId) errors.push('Selecciona una habitación');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.guestPhone.trim()) errors.push('El teléfono es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.baseGuestsCount < 1) errors.push('Mínimo 1 huésped base');

  // Email validation
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email inválido');
  }

  // Date validation
  if (formData.checkIn && formData.checkOut) {
    if (formData.checkOut <= formData.checkIn) {
      errors.push('La fecha de salida debe ser posterior a la de entrada');
    }
    if (formData.checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.push('La fecha de entrada no puede ser en el pasado');
    }
  }

  // Total guests validation
  if (formData.totalGuests !== formData.baseGuestsCount + formData.extraGuestsCount) {
    errors.push('El total de huéspedes no coincide con la suma de huéspedes base y adicionales');
  }

  // Additional guests validation
  if (formData.additionalGuests.length !== formData.extraGuestsCount) {
    errors.push('El número de huéspedes adicionales debe coincidir con la cantidad especificada');
  }
  formData.additionalGuests.forEach((guest, index) => {
    if (!guest.firstName.trim()) {
      errors.push(`El nombre del huésped adicional ${index + 1} es requerido`);
    }
    if (!guest.lastName.trim()) {
      errors.push(`El apellido del huésped adicional ${index + 1} es requerido`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate client reservation form data
 */
export function validateClientReservationForm(
  formData: ClientReservationFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!formData.roomId) errors.push('Selecciona una habitación');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.guestPhone.trim()) errors.push('El teléfono es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.baseGuestsCount < 1) errors.push('Mínimo 1 huésped base');

  // Email validation
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email inválido');
  }

  // Date validation
  if (formData.checkIn && formData.checkOut) {
    if (formData.checkOut <= formData.checkIn) {
      errors.push('La fecha de salida debe ser posterior a la de entrada');
    }
    if (formData.checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.push('La fecha de entrada no puede ser en el pasado');
    }
  }

  // Total guests validation
  if (formData.totalGuests !== formData.baseGuestsCount + formData.extraGuestsCount) {
    errors.push('El total de huéspedes no coincide con la suma de huéspedes base y adicionales');
  }

  // Additional guests validation: all non-principal guests (totalGuests - 1)
  const expectedAdditional = Math.max(formData.totalGuests - 1, 0);
  if (formData.additionalGuests.length !== expectedAdditional) {
    errors.push('El número de huéspedes registrados no coincide con el total seleccionado');
  }
  formData.additionalGuests.forEach((guest, index) => {
    if (!guest.firstName.trim()) {
      errors.push(`El nombre del huésped #${index + 2} es requerido`);
    }
    if (!guest.lastName.trim()) {
      errors.push(`El apellido del huésped #${index + 2} es requerido`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// CALCULATIONS
// ============================================

/**
 * Calculate number of nights between dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.max(differenceInDays(checkOut, checkIn), 0);
}

/**
 * Calculate total price including extra guests
 * Extra guests cost $5 per night per guest
 */
export function calculateTotalPrice(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date,
  extraGuestsCount: number = 0
): number {
  const nights = calculateNights(checkIn, checkOut);
  const EXTRA_GUEST_PRICE_PER_NIGHT = 5;

  const basePrice = nights * pricePerNight;
  const extraGuestsPrice = nights * extraGuestsCount * EXTRA_GUEST_PRICE_PER_NIGHT;

  return basePrice + extraGuestsPrice;
}

/**
 * Format date range for display
 */
export function formatDateRange(checkIn: string | Date, checkOut: string | Date): string {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;

  return `${format(checkInDate, 'dd/MM/yyyy')} - ${format(checkOutDate, 'dd/MM/yyyy')}`;
}

/**
 * Format date for API
 */
export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// ============================================
// FILTERING AND SORTING
// ============================================

/**
 * Filter reservations by status
 */
export function filterReservationsByStatus(
  reservations: ReservationWithDetails[],
  status: 'all' | ReservationStatus
): ReservationWithDetails[] {
  if (status === 'all') return reservations;
  return reservations.filter(r => r.status === status);
}

/**
 * Filter reservations by date range
 */
export function filterReservationsByDateRange(
  reservations: ReservationWithDetails[],
  dateFrom?: Date,
  dateTo?: Date
): ReservationWithDetails[] {
  return reservations.filter(r => {
    const checkIn = new Date(r.checkInDate);
    const checkOut = new Date(r.checkOutDate);

    if (dateFrom && checkOut < dateFrom) return false;
    if (dateTo && checkIn > dateTo) return false;

    return true;
  });
}

/**
 * Filter reservations by search query (guest name, email, room)
 */
export function filterReservationsBySearch(
  reservations: ReservationWithDetails[],
  query: string
): ReservationWithDetails[] {
  if (!query.trim()) return reservations;

  const lowercaseQuery = query.toLowerCase();
  return reservations.filter(r => {
    return (
      r.mainGuest.firstName.toLowerCase().includes(lowercaseQuery) ||
      r.mainGuest.lastName.toLowerCase().includes(lowercaseQuery) ||
      r.mainGuest.email.toLowerCase().includes(lowercaseQuery) ||
      r.room?.number.toLowerCase().includes(lowercaseQuery) ||
      r.room?.name.toLowerCase().includes(lowercaseQuery)
    );
  });
}

/**
 * Sort reservations by date (newest first)
 */
export function sortReservationsByDate(
  reservations: ReservationWithDetails[],
  ascending = false
): ReservationWithDetails[] {
  return [...reservations].sort((a, b) => {
    const dateA = new Date(a.checkInDate).getTime();
    const dateB = new Date(b.checkInDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Get pending reservations count
 */
export function getPendingReservationsCount(
  reservations: ReservationWithDetails[]
): number {
  return reservations.filter(r => r.status === ReservationStatus.PENDING).length;
}

/**
 * Get today's check-ins
 */
export function getTodayCheckIns(
  reservations: ReservationWithDetails[]
): ReservationWithDetails[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return reservations.filter(r => {
    const checkInDate = format(new Date(r.checkInDate), 'yyyy-MM-dd');
    return checkInDate === today && r.status === ReservationStatus.CONFIRMED;
  });
}

/**
 * Get today's check-outs
 */
export function getTodayCheckOuts(
  reservations: ReservationWithDetails[]
): ReservationWithDetails[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return reservations.filter(r => {
    const checkOutDate = format(new Date(r.checkOutDate), 'yyyy-MM-dd');
    return checkOutDate === today && r.status === ReservationStatus.CONFIRMED;
  });
}
