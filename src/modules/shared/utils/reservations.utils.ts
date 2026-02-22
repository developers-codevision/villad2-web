import { format, differenceInDays } from 'date-fns';
import {
  Reservation,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationStatus
} from '@/modules/shared/types/api.types';
import {
  ReservationFormData,
  ReservationWithDetails,
  ClientReservationFormData
} from '@/modules/shared/types/reservations.types';

// Shared utility functions for reservations

/**
 * Get today's check-outs
 */
export function getTodayCheckOuts(reservations: ReservationWithDetails[]): ReservationWithDetails[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return reservations.filter(r => {
    const checkOutDate = format(new Date(r.checkOutDate), 'yyyy-MM-dd');
    return checkOutDate === today && r.status === ReservationStatus.CONFIRMED;
  });
}

/**
 * Get today's check-ins
 */
export function getTodayCheckIns(reservations: ReservationWithDetails[]): ReservationWithDetails[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return reservations.filter(r => {
    const checkInDate = format(new Date(r.checkInDate), 'yyyy-MM-dd');
    return checkInDate === today && r.status === ReservationStatus.CONFIRMED;
  });
}

/**
 * Get pending reservations count
 */
export function getPendingReservationsCount(reservations: ReservationWithDetails[]): number {
  return reservations.filter(r => r.status === ReservationStatus.PENDING).length;
}

/**
 * Sort reservations by date (newest first)
 */
export function sortReservationsByDate(reservations: ReservationWithDetails[], ascending = false): ReservationWithDetails[] {
  return [...reservations].sort((a, b) => {
    const dateA = new Date(a.checkInDate).getTime();
    const dateB = new Date(b.checkInDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Filter reservations by search query (guest name, email, room)
 */
export function filterReservationsBySearch(reservations: ReservationWithDetails[], query: string): ReservationWithDetails[] {
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
 * Format date for API
 */
export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format date range for display
 */
export function formatDateRange(
  checkIn: string | Date,
  checkOut: string | Date
): string {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  return `${format(checkInDate, 'dd/MM/yyyy')} - ${format(checkOutDate, 'dd/MM/yyyy')}`;
}

/**
 * Calculate total price including extra guests
 */
export function calculateTotalPrice(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date,
  extraGuestsCount: number = 0
): number {
  const EXTRA_GUEST_PRICE_PER_NIGHT = 5;
  const nights = calculateNights(checkIn, checkOut);
  const basePrice = nights * pricePerNight;
  const extraGuestsPrice = nights * extraGuestsCount * EXTRA_GUEST_PRICE_PER_NIGHT;
  return basePrice + extraGuestsPrice;
}

/**
 * Calculate number of nights between dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.max(differenceInDays(checkOut, checkIn), 0);
}
