// Admin Room Types - Separated from components

import { Room, RoomType, RoomStatus } from '@/modules/shared/types/api.types';

/**
 * Form data structure for room creation/editing
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
 * Photo state management
 */
export interface RoomPhotoState {
  mainPhotoFile: File | null;
  additionalPhotoFiles: File[];
  originalMainPhoto: string[];
  originalAdditionalPhotos: string[];
}

/**
 * Room list state
 */
export interface RoomListState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

/**
 * Room form state
 */
export interface RoomFormState {
  open: boolean;
  editing: Room | null;
  saving: boolean;
  deleteConfirm: number | null;
}

/**
 * Constants for room types and statuses
 */
export const ROOM_TYPES: RoomType[] = [
  RoomType.INDIVIDUAL,
  RoomType.DOUBLE,
  RoomType.SUITE,
  RoomType.FAMILY,
  RoomType.PRESIDENTIAL,
];

export const ROOM_STATUSES: RoomStatus[] = [
  RoomStatus.AVAILABLE,
  RoomStatus.OCCUPIED,
  RoomStatus.MAINTENANCE,
];

/**
 * Room status labels for display
 */
export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  [RoomStatus.AVAILABLE]: 'Disponible',
  [RoomStatus.OCCUPIED]: 'Ocupada',
  [RoomStatus.MAINTENANCE]: 'Mantenimiento',
};

/**
 * Room status badge variants
 */
export const ROOM_STATUS_VARIANTS: Record<RoomStatus, 'default' | 'destructive' | 'secondary'> = {
  [RoomStatus.AVAILABLE]: 'default',
  [RoomStatus.OCCUPIED]: 'destructive',
  [RoomStatus.MAINTENANCE]: 'secondary',
};

