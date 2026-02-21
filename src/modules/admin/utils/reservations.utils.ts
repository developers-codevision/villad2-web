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
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    specialRequests: '',
    status: ReservationStatus.PENDING,
  };
}

/**
 * Create empty client reservation form
 */
export function createEmptyClientReservationForm(): ClientReservationFormData {
  return {
    roomId: null,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    specialRequests: '',
  };
}

// ============================================
// FORM TRANSFORMATIONS
// ============================================

/**
 * Convert Reservation to FormData for editing
 */
export function reservationToFormData(
  reservation: ReservationWithDetails
): ReservationFormData {
  return {
    roomId: reservation.roomId,
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    guestPhone: reservation.guestPhone || '',
    checkIn: new Date(reservation.checkIn),
    checkOut: new Date(reservation.checkOut),
    guests: reservation.guests,
    specialRequests: reservation.specialRequests || '',
    status: reservation.status,
  };
}

/**
 * Convert FormData to CreateReservationDto
 */
export function formDataToCreateDto(
  formData: ReservationFormData,
  totalPrice: number
): CreateReservationDto {
  if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
    throw new Error('Missing required fields');
  }

  return {
    roomId: formData.roomId,
    guestName: formData.guestName.trim(),
    guestEmail: formData.guestEmail.trim(),
    guestPhone: formData.guestPhone.trim() || undefined,
    checkIn: format(formData.checkIn, 'yyyy-MM-dd'),
    checkOut: format(formData.checkOut, 'yyyy-MM-dd'),
    guests: formData.guests,
    specialRequests: formData.specialRequests.trim() || undefined,
  };
}

/**
 * Convert ClientFormData to CreateReservationDto
 */
export function clientFormDataToCreateDto(
  formData: ClientReservationFormData,
  totalPrice: number
): CreateReservationDto {
  if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
    throw new Error('Missing required fields');
  }

  return {
    roomId: formData.roomId,
    guestName: formData.guestName.trim(),
    guestEmail: formData.guestEmail.trim(),
    guestPhone: formData.guestPhone.trim() || undefined,
    checkIn: format(formData.checkIn, 'yyyy-MM-dd'),
    checkOut: format(formData.checkOut, 'yyyy-MM-dd'),
    guests: formData.guests,
    specialRequests: formData.specialRequests.trim() || undefined,
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
    specialRequests: formData.specialRequests.trim() || undefined,
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
  if (!formData.guestName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.guests < 1) errors.push('Mínimo 1 huésped');

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
  if (!formData.guestName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.guests < 1) errors.push('Mínimo 1 huésped');

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
 * Calculate total price
 */
export function calculateTotalPrice(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = calculateNights(checkIn, checkOut);
  return nights * pricePerNight;
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
    const checkIn = new Date(r.checkIn);
    const checkOut = new Date(r.checkOut);

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
      r.guestName.toLowerCase().includes(lowercaseQuery) ||
      r.guestEmail.toLowerCase().includes(lowercaseQuery) ||
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
    const dateA = new Date(a.checkIn).getTime();
    const dateB = new Date(b.checkIn).getTime();
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
    const checkInDate = format(new Date(r.checkIn), 'yyyy-MM-dd');
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
    const checkOutDate = format(new Date(r.checkOut), 'yyyy-MM-dd');
    return checkOutDate === today && r.status === ReservationStatus.CONFIRMED;
  });
}

