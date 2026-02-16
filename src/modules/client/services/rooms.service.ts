// Rooms service - handles room-related API calls
import { apiClient } from '@/modules/shared/services/api';

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  amenities: string[];
}

export const roomsService = {
  getAll: () => apiClient.get<Room[]>('/rooms'),
  getById: (id: string) => apiClient.get<Room>(`/rooms/${id}`),
};

