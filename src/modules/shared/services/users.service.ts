// Users API Service

import { authenticatedApiClient } from './api';
import { User } from '../types/api.types';

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phone?: string;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  roles?: string[];
  isActive?: boolean;
  password?: string;
}

export const usersService = {
  /**
   * Get current user profile (authenticated user)
   */
  async getProfile(): Promise<User> {
    return authenticatedApiClient.get<User>('/users/profile');
  },

  /**
   * Get all users (admin only)
   */
  async getAll(): Promise<User[]> {
    return authenticatedApiClient.get<User[]>('/users');
  },

  /**
   * Get user by ID (admin only)
   */
  async getById(id: number): Promise<User> {
    return authenticatedApiClient.get<User>(`/users/${id}`);
  },

  /**
   * Create a new user (admin only)
   */
  async create(data: CreateUserDto): Promise<User> {
    return authenticatedApiClient.post<User>('/users', data);
  },

  /**
   * Update a user (admin only)
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    return authenticatedApiClient.put<User>(`/users/${id}`, data);
  },

  /**
   * Delete a user (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete<void>(`/users/${id}`);
  },
};

