// Admin rooms service
import { adminApiClient } from './api';
import type { Room } from '@/modules/client/services/rooms.service';

export const adminRoomsService = {
  getAll: () => adminApiClient.get<Room[]>('/admin/rooms'),

  create: (data: Omit<Room, 'id'>) =>
    adminApiClient.post<Room>('/admin/rooms', data),

  update: (id: string, data: Partial<Room>) =>
    adminApiClient.put<Room>(`/admin/rooms/${id}`, data),

  delete: (id: string) => adminApiClient.delete(`/admin/rooms/${id}`),
};

