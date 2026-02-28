// Promotions API Service

import { apiClient, authenticatedApiClient } from './api';
import {
  Promotion,
  PromotionStatus,
} from '../types/api.types';

/**
 * Promotions Service - API calls for promotion management
 */
export const promotionsService = {
  /**
   * Get all promotions with optional filters
   */
  async getAll(
    status?: PromotionStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    promotions: Promotion[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiClient.get<{
      promotions: Promotion[];
      total: number;
      page: number;
      limit: number;
    }>(`/promotions?${params.toString()}`);
  },

  /**
   * Get a promotion by ID
   */
  async getById(id: number): Promise<Promotion> {
    return apiClient.get<Promotion>(`/promotions/${id}`);
  },

  /**
   * Create a new promotion (admin only)
   */
  async create(dto: FormData): Promise<Promotion> {
    return authenticatedApiClient.postFormData<Promotion>('/promotions', dto);
  },

  /**
   * Update a promotion (admin only)
   */
  async update(id: number, dto: FormData): Promise<Promotion> {
    return authenticatedApiClient.putFormData<Promotion>(`/promotions/${id}`, dto);
  },

  /**
   * Change promotion status (admin only)
   */
  async changeStatus(id: number, status: PromotionStatus): Promise<Promotion> {
    return authenticatedApiClient.put<Promotion>(
      `/promotions/${id}/status`,
      { status }
    );
  },

  /**
   * Delete a promotion (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete<void>(`/promotions/${id}`);
  },
};

