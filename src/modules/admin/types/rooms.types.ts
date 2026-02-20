// Admin Room Types - UI-specific types and constants
// Backend types (Room, RoomType, RoomStatus, DTOs) are in @/modules/shared/types/api.types

import { Room, RoomType, RoomStatus } from '@/modules/shared/types/api.types';

// ============================================
// ADMIN-SPECIFIC FORM TYPES
// ============================================

/**
 * Form data structure for room creation/editing in admin panel
 * Note: This is different from CreateRoomDto/UpdateRoomDto because
 * it's used for UI state management with additional fields like photo URLs
 */
export interface RoomFormData {
  numero: string;
  nombre: string;
  descripcion: string;
  precio_por_noche: number;
  capacidad_personas: number;
  tipo_habitacion: RoomType;
  amenities_habitacion: string[];
  amenities_banno: string[];
  estado: RoomStatus;
  foto_principal: string[];
  fotos_adicionales: string[];
}

/**
 * Photo state management for admin forms
 */
export interface RoomPhotoState {
  mainPhotoFile: File | null;
  additionalPhotoFiles: File[];
  originalMainPhoto: string[];
  originalAdditionalPhotos: string[];
}

/**
 * Room list state for admin panel
 */
export interface RoomListState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

/**
 * Room form dialog state
 */
export interface RoomFormState {
  open: boolean;
  editing: Room | null;
  saving: boolean;
  deleteConfirm: number | null;
}

// ============================================
// UI CONSTANTS (for admin panel dropdowns, labels, etc.)
// ============================================

/**
 * Spanish labels for room statuses (for display in admin UI)
 */
export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  [RoomStatus.AVAILABLE]: 'Disponible',
  [RoomStatus.OCCUPIED]: 'Ocupada',
  [RoomStatus.MAINTENANCE]: 'Mantenimiento',
};

/**
 * Room type labels (Spanish)
 */
export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.INDIVIDUAL]: 'Individual',
  [RoomType.DOUBLE]: 'Doble',
  [RoomType.SUITE]: 'Suite',
  [RoomType.FAMILY]: 'Familiar',
  [RoomType.PRESIDENTIAL]: 'Presidencial',
};

/**
 * Badge variants for room statuses (for UI styling)
 */
export const ROOM_STATUS_VARIANTS: Record<RoomStatus, 'default' | 'destructive' | 'secondary'> = {
  [RoomStatus.AVAILABLE]: 'default',
  [RoomStatus.OCCUPIED]: 'destructive',
  [RoomStatus.MAINTENANCE]: 'secondary',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all room types as array (for Select options)
 * Dynamically generates from enum to avoid duplication
 */
export function getRoomTypes(): RoomType[] {
  return Object.values(RoomType);
}

/**
 * Get all room statuses as array (for Select options)
 * Dynamically generates from enum to avoid duplication
 */
export function getRoomStatuses(): RoomStatus[] {
  return Object.values(RoomStatus);
}

