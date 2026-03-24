// Authentication Context - Single source of truth for authentication state
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User, LoginDto, AuthResponse } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rebuild in-memory auth on app boot using refresh token if needed
  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedUser = authService.getUser();
      if (storedUser) {
        setUser(storedUser);
      }

      if (authService.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      if (!authService.getRefreshToken()) {
        if (storedUser) {
          await authService.logout();
          setUser(null);
        }
        setIsLoading(false);
        return;
      }

      try {
        await authService.refreshToken();

        if (!storedUser) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = useCallback(async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    } catch {
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!user && authService.isAuthenticated();
  const isAdmin = user?.roles?.includes('admin') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
