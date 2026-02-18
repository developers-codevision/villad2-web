// Authentication Service with secure token management

import { AuthResponse, LoginDto, RegisterDto, User, RefreshTokenResponse } from '../types/api.types';
import { apiPost, apiGet } from '../lib/api-client';

const TOKEN_KEY = 'villad2_auth_token';
const REFRESH_TOKEN_KEY = 'villad2_refresh_token';
const USER_KEY = 'villad2_user';

class AuthService {
  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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
    return !!this.getToken();
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.roles?.includes('admin') || false;
  }

  /**
   * Store authentication data securely
   */
  private storeAuth(token: string, user: User, refreshToken?: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const data = await apiPost<AuthResponse>('/auth/login', credentials, { skipAuth: true });
      this.storeAuth(data.access_token, data.user, data.refresh_token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    try {
      const data = await apiPost<AuthResponse>('/auth/register', userData, { skipAuth: true });
      this.storeAuth(data.access_token, data.user, data.refresh_token);
      return data;
    } catch (error) {
      throw error;
    }
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
        await apiPost<void>('/auth/logout', {});
      } catch (error) {
        // Silently fail - local logout already done
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
      const data = await apiPost<RefreshTokenResponse>(
        '/auth/refresh',
        { refresh_token: refreshToken },
        { skipAuth: true }
      );

      // Update tokens
      localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      }

      return data.access_token;
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
      const user = await apiGet<User>('/auth/profile');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }
}

export const authService = new AuthService();

