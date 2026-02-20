// Admin Room Utils - Helper functions separated from components

import { Room, CreateRoomDto, UpdateRoomDto } from '@/modules/shared/types/api.types';
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
    capacidad_personas: room.capacity,
    tipo_habitacion: room.roomType,
    amenities_habitacion: room.roomAmenities || [],
    amenities_banno: room.bathroomAmenities || [],
    estado: room.status,
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
    capacity: formData.capacidad_personas,
    roomType: formData.tipo_habitacion,
    roomAmenities: amenities,
    bathroomAmenities: amenitiesBanno,
    status: formData.estado,
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

  if (formData.capacidad_personas < 1) {
    return { valid: false, error: 'La capacidad debe ser al menos 1' };
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
    capacidad_personas: 1,
    tipo_habitacion: 'individual' as const,
    amenities_habitacion: [],
    amenities_banno: [],
    estado: 'available' as const,
    foto_principal: [],
    fotos_adicionales: [],
  };
}

