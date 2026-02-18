// Rooms service - handles room-related API calls
import { apiClient } from '@/modules/shared/services/api';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  SUITE = 'SUITE',
  FAMILY = 'FAMILY',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
}

export interface Room {
  id: number;
  number: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomType: RoomType;
  roomAmenities: string[];
  bathroomAmenities: string[] | null;
  status: RoomStatus;
  mainPhoto: string[];
  additionalPhotos: string[] | null;
  floor: number | null;
  hasJacuzzi: boolean;
  hasTv: boolean;
  hasAirConditioning: boolean;
  hasBalcony: boolean;
  hasMinibar: boolean;
  hasSeaView: boolean;
  hasWifi: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const roomsService = {
  getAll: () => apiClient.get<Room[]>('/rooms'),
  getById: (id: number) => apiClient.get<Room>(`/rooms/${id}`),
};

