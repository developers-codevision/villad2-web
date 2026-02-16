// API service for client module
export default apiClient;

};
  },
    return response.json();
    if (!response.ok) throw new Error('Network response was not ok');
    });
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {

  },
    return response.json();
    if (!response.ok) throw new Error('Network response was not ok');
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
  get: async <T>(endpoint: string): Promise<T> => {
export const apiClient = {

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Base API configuration

