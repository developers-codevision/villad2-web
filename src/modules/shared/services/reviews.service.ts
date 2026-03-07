// Reviews API Service

import { apiClient, authenticatedApiClient } from './api';
import {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewStatus,
} from '../types/api.types';

/**
 * Reviews Service - API calls for review management
 */
export const reviewsService = {
  /**
   * Get all reviews with optional filters (public for ACTIVE reviews, admin for others)
   */
  async getAll(
    status?: ReviewStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Use public client for ACTIVE reviews, authenticated client for others
    const client = status === ReviewStatus.ACTIVE ? apiClient : authenticatedApiClient;

    return client.get<{
      reviews: Review[];
      total: number;
      page: number;
      limit: number;
    }>(`/reviews?${params.toString()}`);
  },

  /**
   * Get a review by ID
   */
  async getById(id: number): Promise<Review> {
    return authenticatedApiClient.get<Review>(`/reviews/${id}`);
  },

  /**
   * Create a new review (public)
   */
  async create(dto: CreateReviewDto): Promise<Review> {
    // Asegurar que las nuevas reseñas comienzan como INACTIVE
    return apiClient.post<Review>('/reviews', {
      ...dto,
      status: ReviewStatus.INACTIVE,
    });
  },

  /**
   * Update a review (admin only)
   */
  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    return authenticatedApiClient.patch<Review>(`/reviews/${id}`, dto);
  },

  /**
   * Change review status (admin only)
   */
  async changeStatus(id: number, status: ReviewStatus): Promise<Review> {
    return authenticatedApiClient.patch<Review>(`/reviews/${id}/status`, {
      status,
    });
  },

  /**
   * Add response to a review (admin only)
   */
  async addResponse(id: number, response: string): Promise<Review> {
    return authenticatedApiClient.patch<Review>(`/reviews/${id}/response`, {
      response,
    });
  },

  /**
   * Delete response from a review (admin only)
   */
  async deleteResponse(id: number): Promise<Review> {
    return authenticatedApiClient.patch<Review>(`/reviews/${id}/response`, {
      response: null,
    });
  },

  /**
   * Delete a review (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete<void>(`/reviews/${id}`);
  },
};

