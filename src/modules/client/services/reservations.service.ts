// Reservations service - handles reservation-related API calls
import { apiClient } from '@/modules/shared/services/api';

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const reservationsService = {
  create: (data: Omit<Reservation, 'id' | 'status'>) =>
    apiClient.post<Reservation>('/reservations', data),

  getAll: () => apiClient.get<Reservation[]>('/reservations'),
};

