// Admin Reservations Types - UI-specific types and constants
// Backend types (Reservation, ReservationStatus, DTOs) are in @/modules/shared/types/api.types

import { Reservation, ReservationStatus, GuestInfo } from '@/modules/shared/types/api.types';

// ============================================
// ADMIN-SPECIFIC FORM TYPES
// ============================================

/**
 * Form data structure for reservation creation/editing in admin panel
 * Used for manual reservations (phone, walk-in, etc.)
 */
export interface ReservationFormData {
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
  status: ReservationStatus;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
}

/**
 * Extended reservation with room details for admin view
 */
export interface ReservationWithDetails extends Reservation {
  room?: {
    number: string;
    name: string;
    roomType: string;
  };
}

/**
 * Reservation list state for admin panel
 */
export interface ReservationListState {
  reservations: ReservationWithDetails[];
  loading: boolean;
  error: string | null;
}

/**
 * Reservation form dialog state
 */
export interface ReservationFormState {
  open: boolean;
  editing: ReservationWithDetails | null;
  saving: boolean;
  deleteConfirm: number | null;
  statusChangeConfirm: {
    id: number;
    newStatus: ReservationStatus;
  } | null;
}

/**
 * Filter state for reservation list
 */
export interface ReservationFilterState {
  status: 'all' | ReservationStatus;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  searchQuery: string;
}

// ============================================
// CLIENT-SPECIFIC TYPES
// ============================================

/**
 * Client reservation form data (simpler, no status selection)
 */
export interface ClientReservationFormData {
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
 * Client reservation step state
 */
export interface ClientReservationStep {
  current: 'dates' | 'room' | 'details' | 'confirmation';
  completed: boolean;
}

// ============================================
// UI CONSTANTS
// ============================================

/**
 * Spanish labels for reservation statuses
 */
export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Pendiente',
  [ReservationStatus.CONFIRMED]: 'Confirmada',
  [ReservationStatus.CANCELLED]: 'Cancelada',
  [ReservationStatus.COMPLETED]: 'Completada',
};

/**
 * Badge variants for reservation statuses
 */
export const RESERVATION_STATUS_VARIANTS: Record<
  ReservationStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
> = {
  [ReservationStatus.PENDING]: 'pending',
  [ReservationStatus.CONFIRMED]: 'confirmed',
  [ReservationStatus.CANCELLED]: 'cancelled',
  [ReservationStatus.COMPLETED]: 'completed',
};

/**
 * Icon colors for reservation statuses
 */
export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'text-yellow-500',
  [ReservationStatus.CONFIRMED]: 'text-green-500',
  [ReservationStatus.CANCELLED]: 'text-red-500',
  [ReservationStatus.COMPLETED]: 'text-blue-500',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all reservation statuses as array (for Select options)
 */
export function getReservationStatuses(): ReservationStatus[] {
  return Object.values(ReservationStatus);
}

/**
 * Get filterable reservation statuses (for admin filter)
 */
export function getFilterableStatuses(): Array<{ value: string; label: string }> {
  return [
    { value: 'all', label: 'Todas' },
    ...getReservationStatuses().map(status => ({
      value: status,
      label: RESERVATION_STATUS_LABELS[status],
    })),
  ];
}

/**
 * Check if reservation is editable
 */
export function isReservationEditable(status: ReservationStatus): boolean {
  return status === ReservationStatus.PENDING || status === ReservationStatus.CONFIRMED;
}

/**
 * Check if reservation can be confirmed
 */
export function canConfirmReservation(status: ReservationStatus): boolean {
  return status === ReservationStatus.PENDING;
}

/**
 * Check if reservation can be cancelled
 */
export function canCancelReservation(status: ReservationStatus): boolean {
  return status === ReservationStatus.PENDING || status === ReservationStatus.CONFIRMED;
}

/**
 * Check if reservation can be completed
 */
export function canCompleteReservation(status: ReservationStatus): boolean {
  return status === ReservationStatus.CONFIRMED;
}

/**
 * Get available status transitions
 */
export function getAvailableStatusTransitions(
  currentStatus: ReservationStatus
): ReservationStatus[] {
  const transitions: Record<ReservationStatus, ReservationStatus[]> = {
    [ReservationStatus.PENDING]: [
      ReservationStatus.CONFIRMED,
      ReservationStatus.CANCELLED,
    ],
    [ReservationStatus.CONFIRMED]: [
      ReservationStatus.COMPLETED,
      ReservationStatus.CANCELLED,
    ],
    [ReservationStatus.CANCELLED]: [],
    [ReservationStatus.COMPLETED]: [],
  };

  return transitions[currentStatus] || [];
}
