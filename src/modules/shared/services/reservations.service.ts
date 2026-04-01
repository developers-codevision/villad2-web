// Reservations API Service

import { apiClient, authenticatedApiClient } from './api';
import { Reservation, CreateReservationDto, UpdateReservationDto, OccupiedDay, OccupiedRange } from '../types/api.types';

/**
 * Get occupied dates for reservations
 * Returns an array of date strings in YYYY-MM-DD format
 */
export const reservationsService = {
  /**
   * Get all reservations (admin only)
   */
  async getAll(): Promise<Reservation[]> {
    const response = await authenticatedApiClient.get<{
      reservations: Reservation[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }>('/reservations');
    return response.reservations;
  },

  /**
   * Get a reservation by ID (admin only)
   */
  async getById(id: number): Promise<Reservation> {
    return authenticatedApiClient.get<Reservation>(`/reservations/${id}`);
  },

  /**
   * Create a new reservation
   */
  async create(dto: CreateReservationDto): Promise<Reservation> {
    return authenticatedApiClient.post<Reservation>('/reservations', dto);
  },

  /**
   * Update a reservation (admin only)
   */
  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    return authenticatedApiClient.put<Reservation>(`/reservations/${id}`, dto);
  },

  /**
   * Delete a reservation (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete(`/reservations/${id}`);
  },

  /**
   * Get occupied hours grouped by room ID
   * Returns an object with room IDs as keys and arrays of occupied ranges {start,end}
   */
  async getOccupiedHoursGrouped(): Promise<{ [key: number]: OccupiedRange[] }> {
    return apiClient.get<{ [key: number]: OccupiedRange[] }>('/reservations/occupied-hours');
  },

  /**
   * Create a new reservation with payment (Stripe checkout session)
   */
  async createWithPayment(dto: CreateReservationDto): Promise<{
    reservation: Reservation;
    paymentSession: { sessionId: string; url: string }
  }> {
    return apiClient.post<{
      reservation: Reservation;
      paymentSession: { sessionId: string; url: string }
    }>('/reservations/with-payment', dto);
  },

  /**
   * Get occupied hours for a specific room
   * Returns an array of days with their occupied hour ranges
   */
  async getOccupiedHoursForRoom(roomId: number): Promise<OccupiedDay[]> {
    return apiClient.get<OccupiedDay[]>(`/reservations/occupied-hours/${roomId}`);
  },
};
