// Admin reservations service
import { adminApiClient } from './api';
import type { Reservation } from '@/modules/client/services/reservations.service';

export const adminReservationsService = {
  getAll: () => adminApiClient.get<Reservation[]>('/admin/reservations'),

  updateStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') =>
    adminApiClient.put(`/admin/reservations/${id}`, { status }),

  delete: (id: string) => adminApiClient.delete(`/admin/reservations/${id}`),
};

