// Authentication Service with secure token management

import { AuthResponse, LoginDto, RegisterDto, User } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'villad2_auth_token';
const USER_KEY = 'villad2_user';

class AuthService {
  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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
  private storeAuth(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Error al iniciar sesión',
      }));
      throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
    }

    const data: AuthResponse = await response.json();
    this.storeAuth(data.access_token, data.user);
    return data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Error al registrar usuario',
      }));
      throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
    }

    const data: AuthResponse = await response.json();
    this.storeAuth(data.access_token, data.user);
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Silently fail - local logout already done
        console.warn('Error notifying server of logout:', error);
      }
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

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Sesión expirada');
      }
      throw new Error('Error al obtener perfil de usuario');
    }

    const user: User = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
}

export const authService = new AuthService();

