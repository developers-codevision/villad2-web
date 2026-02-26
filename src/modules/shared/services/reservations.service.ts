// Reservations API Service

import { apiClient, authenticatedApiClient } from './api';
import { Reservation, CreateReservationDto, UpdateReservationDto, ReservationStatus } from '../types/api.types';

/**
 * Get occupied dates for reservations
 * Returns an array of date strings in YYYY-MM-DD format
 */
export const reservationsService = {
  /**
   * Get all reservations (admin only)
   */
  async getAll(): Promise<Reservation[]> {
    return authenticatedApiClient.get<Reservation[]>('/reservations');
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
    return apiClient.post<Reservation>('/reservations', dto);
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
   * Get all occupied dates grouped by room ID
   * Returns an object with room IDs as keys and arrays of date strings in YYYY-MM-DD format as values
   */
  async getOccupiedDatesGrouped(): Promise<{ [key: number]: string[] }> {
    return apiClient.get<{ [key: number]: string[] }>('/reservations/occupied-dates');
  },

  /**
   * Get occupied dates for a specific room
   * Returns an array of date strings in YYYY-MM-DD format
   */
  async getOccupiedDatesForRoom(roomId: number): Promise<string[]> {
    return apiClient.get<string[]>(`/reservations/occupied-dates/${roomId}`);
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
};
