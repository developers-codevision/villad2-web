// Base API service with improved error handling and authentication support
import { authService } from './auth.service';
import { ApiError } from '../types/api.types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get full URL for media paths
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Parse API error response
 */
async function parseError(response: Response): Promise<never> {
  try {
    const error: ApiError = await response.json();
    const message = Array.isArray(error.message)
      ? error.message[0]
      : error.message || 'Error en la solicitud';
    throw new Error(message);
  } catch (e) {
    if (e instanceof Error && e.message !== 'Error en la solicitud') {
      throw e;
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
}

/**
 * Base API client for public endpoints (no authentication required)
 */
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await parseError(response);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error('Invalid JSON response from server');
    }
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response);
    }

    return response.json();
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response);
    }

    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await parseError(response);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return undefined as T;
  },
};

const SESSION_REQUIRED_MESSAGE = 'No hay sesión activa. Por favor, inicia sesión.';
const SESSION_EXPIRED_MESSAGE = 'Sesión expirada. Por favor, inicia sesión nuevamente.';

function buildAuthHeaders(token: string, headers?: HeadersInit, includeJsonContentType = true): Headers {
  const mergedHeaders = new Headers(headers || {});
  mergedHeaders.set('Authorization', `Bearer ${token}`);

  if (includeJsonContentType && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  return mergedHeaders;
}

async function parseJsonOrEmpty<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid JSON response from server');
  }
}

async function parseDeleteResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return parseJsonOrEmpty<T>(response);
  }

  return undefined as T;
}

async function authenticatedFetch(
  endpoint: string,
  init: RequestInit = {},
  includeJsonContentType = true,
): Promise<Response> {
  const token = authService.getToken();
  if (!token) {
    throw new Error(SESSION_REQUIRED_MESSAGE);
  }

  const requestWithToken = (accessToken: string): RequestInit => ({
    ...init,
    headers: buildAuthHeaders(accessToken, init.headers, includeJsonContentType),
  });

  let response = await fetch(`${API_BASE_URL}${endpoint}`, requestWithToken(token));

  if (response.status !== 401) {
    return response;
  }

  try {
    await authService.refreshToken();
  } catch {
    await authService.logout();
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  const refreshedToken = authService.getToken();
  if (!refreshedToken) {
    await authService.logout();
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  response = await fetch(`${API_BASE_URL}${endpoint}`, requestWithToken(refreshedToken));

  if (response.status === 401) {
    await authService.logout();
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  return response;
}

/**
 * Authenticated API client for protected endpoints
 */
export const authenticatedApiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await authenticatedFetch(endpoint);

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await authenticatedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await authenticatedFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await authenticatedFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await authenticatedFetch(endpoint, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await parseError(response);
    }

    return parseDeleteResponse<T>(response);
  },

  /**
   * Upload files with FormData (for multipart/form-data)
   */
  postFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await authenticatedFetch(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      false,
    );

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  putFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await authenticatedFetch(
      endpoint,
      {
        method: 'PUT',
        body: formData,
      },
      false,
    );

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },

  patchFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await authenticatedFetch(
      endpoint,
      {
        method: 'PATCH',
        body: formData,
      },
      false,
    );

    if (!response.ok) {
      await parseError(response);
    }

    return parseJsonOrEmpty<T>(response);
  },
};

export default apiClient;
