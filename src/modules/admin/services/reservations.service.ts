// Admin reservations service
import { authenticatedApiClient } from '@/modules/shared/services/api';
import type { Reservation } from '@/modules/client/services/reservations.service';

export const adminReservationsService = {
  getAll: () => authenticatedApiClient.get<Reservation[]>('/admin/reservations'),

  updateStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') =>
    authenticatedApiClient.put(`/admin/reservations/${id}`, { status }),

  delete: (id: string) => authenticatedApiClient.delete(`/admin/reservations/${id}`),
};

