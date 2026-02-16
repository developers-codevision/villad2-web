// Admin API service with authentication
import { apiClient } from '@/modules/shared/services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('backoffice_auth');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminApiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};

