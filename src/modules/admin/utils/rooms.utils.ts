// Admin Room Utils - Helper functions separated from components

import { Room, CreateRoomDto, UpdateRoomDto, RoomType, RoomStatus } from '@/modules/shared/types/api.types';
import { RoomFormData, RoomPhotoState } from '../types/rooms.types';
import { roomsService } from '@/modules/shared/services';

/**
 * Convert Room entity to form data for editing
 */
export function roomToFormData(room: Room, getImageUrl: (path: string) => string): RoomFormData {
  const mainPhotoUrls = (room.mainPhoto || []).map(getImageUrl);
  const additionalPhotoUrls = (room.additionalPhotos || []).map(getImageUrl);

  return {
    numero: room.number,
    nombre: room.name,
    descripcion: room.description,
    precio_por_noche: room.pricePerNight,
    baseCapacity: room.baseCapacity || 0,
    extraCapacity: room.extraCapacity || 0,
    extraGuestCharge: room.extraGuestCharge || 0,
    tipo_habitacion: room.roomType,
    amenities_habitacion: room.roomAmenities || [],
    amenities_banno: room.bathroomAmenities || [],
    estado: room.status,
    floor: room.floor ?? 0,
    hasJacuzzi: room.hasJacuzzi ?? false,
    hasTv: room.hasTv ?? false,
    hasAirConditioning: room.hasAirConditioning ?? false,
    hasHeating: room.hasHeating ?? false,
    isPetFriendly: room.isPetFriendly ?? false,
    foto_principal: mainPhotoUrls,
    fotos_adicionales: additionalPhotoUrls,
  };
}

/**
 * Convert form data to CreateRoomDto
 */
export function formDataToCreateDto(
  formData: RoomFormData,
  amenityInput: string,
  amenityBannoInput: string
): CreateRoomDto {
  const amenities = amenityInput.split(',').map(s => s.trim()).filter(Boolean);
  const amenitiesBanno = amenityBannoInput.split(',').map(s => s.trim()).filter(Boolean);

  return {
    number: formData.numero.trim(),
    name: formData.nombre.trim(),
    description: formData.descripcion.trim(),
    pricePerNight: formData.precio_por_noche,
    baseCapacity: formData.baseCapacity,
    extraCapacity: formData.extraCapacity,
    extraGuestCharge: formData.extraGuestCharge,
    roomType: formData.tipo_habitacion,
    roomAmenities: amenities,
    bathroomAmenities: amenitiesBanno,
    status: formData.estado,
    floor: formData.floor,
    hasJacuzzi: formData.hasJacuzzi,
    hasTv: formData.hasTv,
    hasAirConditioning: formData.hasAirConditioning,
    hasHeating: formData.hasHeating,
    isPetFriendly: formData.isPetFriendly,
  };
}

/**
 * Convert form data to UpdateRoomDto
 */
export function formDataToUpdateDto(
  formData: RoomFormData,
  amenityInput: string,
  amenityBannoInput: string
): UpdateRoomDto {
  return formDataToCreateDto(formData, amenityInput, amenityBannoInput);
}

/**
 * Calculate which original photos should be kept after editing
 */
export function calculateKeptPhotos(
  formData: RoomFormData,
  photoState: Pick<RoomPhotoState, 'originalMainPhoto' | 'originalAdditionalPhotos'>,
  getImageUrl: (path: string) => string
): string[] {
  const originalMainUrls = photoState.originalMainPhoto.map(getImageUrl);
  const originalAdditionalUrls = photoState.originalAdditionalPhotos.map(getImageUrl);

  const keptMainPhotos = photoState.originalMainPhoto.filter((_, i) =>
    formData.foto_principal.includes(originalMainUrls[i])
  );

  const keptAdditionalPhotos = photoState.originalAdditionalPhotos.filter((_, i) =>
    formData.fotos_adicionales.includes(originalAdditionalUrls[i])
  );

  return [...keptMainPhotos, ...keptAdditionalPhotos];
}

/**
 * Parse amenities array to comma-separated string
 */
export function amenitiesToString(amenities: string[] | null | undefined): string {
  return (amenities || []).join(', ');
}

/**
 * Get full image URL from relative path
 */
export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return roomsService.getMediaUrl(path);
}

/**
 * Validate room form data
 */
export function validateRoomForm(formData: RoomFormData): { valid: boolean; error?: string } {
  if (!formData.numero.trim()) {
    return { valid: false, error: 'El número de habitación es obligatorio' };
  }

  if (!formData.nombre.trim()) {
    return { valid: false, error: 'El nombre de habitación es obligatorio' };
  }

  if (formData.precio_por_noche <= 0) {
    return { valid: false, error: 'El precio debe ser mayor a 0' };
  }

  if (formData.baseCapacity < 1) {
    return { valid: false, error: 'La capacidad base debe ser al menos 1' };
  }

  return { valid: true };
}

/**
 * Create empty form data
 */
export function createEmptyFormData(): RoomFormData {
  return {
    numero: '',
    nombre: '',
    descripcion: '',
    precio_por_noche: 0,
    baseCapacity: 1,
    extraCapacity: 0,
    extraGuestCharge: 5,
    tipo_habitacion: RoomType.INDIVIDUAL,
    amenities_habitacion: [],
    amenities_banno: [],
    estado: RoomStatus.AVAILABLE,
    floor: 0,
    hasJacuzzi: false,
    hasTv: false,
    hasAirConditioning: false,
    hasHeating: false,
    isPetFriendly: false,
    foto_principal: [],
    fotos_adicionales: [],
  };
}
