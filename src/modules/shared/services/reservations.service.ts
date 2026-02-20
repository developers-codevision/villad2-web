// Reservations API Service

import { apiClient, authenticatedApiClient } from './api';
import { Reservation, CreateReservationDto, UpdateReservationDto, ReservationStatus } from '../types/api.types';

export const reservationsService = {
  /**
   * Create a new reservation (public endpoint)
   */
  async create(data: CreateReservationDto): Promise<Reservation> {
    return apiClient.post<Reservation>('/reservations', data);
  },

  /**
   * Get all reservations for current user (authenticated)
   */
  async getMyReservations(): Promise<Reservation[]> {
    return authenticatedApiClient.get<Reservation[]>('/reservations/my');
  },

  /**
   * Get all reservations (admin only)
   */
  async getAll(): Promise<Reservation[]> {
    return authenticatedApiClient.get<Reservation[]>('/reservations');
  },

  /**
   * Get reservation by ID (authenticated)
   */
  async getById(id: number): Promise<Reservation> {
    return authenticatedApiClient.get<Reservation>(`/reservations/${id}`);
  },

  /**
   * Update reservation status (admin only)
   */
  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return authenticatedApiClient.put<Reservation>(`/reservations/${id}`, { status });
  },

  /**
   * Update reservation (admin only)
   */
  async update(id: number, data: UpdateReservationDto): Promise<Reservation> {
    return authenticatedApiClient.put<Reservation>(`/reservations/${id}`, data);
  },

  /**
   * Cancel reservation (authenticated)
   */
  async cancel(id: number): Promise<Reservation> {
    return authenticatedApiClient.put<Reservation>(`/reservations/${id}/cancel`, {});
  },

  /**
   * Delete reservation (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete<void>(`/reservations/${id}`);
  },
};

