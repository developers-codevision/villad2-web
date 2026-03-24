// Authentication Service with secure token management

import { AuthResponse, LoginDto, RegisterDto, User, RefreshTokenResponse } from '../types/api.types';
import { apiClient } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const REFRESH_TOKEN_KEY = 'villad2_refresh_token';
const USER_KEY = 'villad2_user';

class AuthService {
  private accessToken: string | null = null;

  /**
   * Get the in-memory authentication token
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get the stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Get the stored user data
   */
  getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.roles?.includes('admin') || false;
  }

  /**
   * Store authentication data
   */
  private storeAuth(token: string, user: User, refreshToken?: string): void {
    this.accessToken = token;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/login', credentials);
    this.storeAuth(data.accessToken, data.user, data.refreshToken);
    return data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/register', userData);
    this.storeAuth(data.accessToken, data.user, data.refreshToken);
    return data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const token = this.getToken();

    // Clear local auth data first
    this.clearAuth();

    // Try to notify server, but don't fail if it doesn't work
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.warn('Error notifying server of logout:', error);
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      throw new Error('No refresh token available');
    }

    try {
      const data = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      });

      this.accessToken = data.accessToken;
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Get current user profile (refresh user data)
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener el perfil de usuario');
      }

      const user = (await response.json()) as User;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }
}

export const authService = new AuthService();

