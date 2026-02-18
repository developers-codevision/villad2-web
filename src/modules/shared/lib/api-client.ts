// HTTP Client with automatic token refresh
import { authService } from '../services/auth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Enhanced fetch with automatic token refresh
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  // Add authorization header if not skipped
  if (!skipAuth) {
    const token = authService.getToken();
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Add content-type if not present and body exists
  if (fetchOptions.body && !(fetchOptions.headers as any)?.['Content-Type']) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  let response = await fetch(url, fetchOptions);

  // If unauthorized, try to refresh token
  if (response.status === 401 && !skipAuth && authService.getRefreshToken()) {
    try {
      // Prevent multiple refresh requests
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = authService.refreshToken();
      }

      const newToken = await refreshPromise!;
      isRefreshing = false;
      refreshPromise = null;

      // Retry request with new token
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${newToken}`,
      };

      response = await fetch(url, fetchOptions);
    } catch (error) {
      isRefreshing = false;
      refreshPromise = null;
      // Token refresh failed, user needs to login again
      throw error;
    }
  }

  return response;
}

/**
 * Helper function for GET requests
 */
export async function apiGet<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, { ...options, method: 'GET' });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  return response.json();
}

/**
 * Helper function for POST requests
 */
export async function apiPost<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  return response.json();
}

/**
 * Helper function for PUT requests
 */
export async function apiPut<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  return response.json();
}

/**
 * Helper function for PATCH requests
 */
export async function apiPatch<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  return response.json();
}

/**
 * Helper function for DELETE requests
 */
export async function apiDelete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, { ...options, method: 'DELETE' });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  // Some DELETE requests might not return content
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

