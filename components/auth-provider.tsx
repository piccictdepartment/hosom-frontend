'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  apiRequest,
  getStoredToken,
  isDemoModeEnabled,
  setDemoModeEnabled,
  setStoredToken,
  type AuthUser,
} from '@/lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  demoMode: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const refreshUser = useCallback(async () => {
    const activeToken = getStoredToken();
    if (!activeToken) {
      setUser(null);
      setToken(null);
      return null;
    }
    try {
      const { data } = await apiRequest<AuthUser>('/api/auth/me', { token: activeToken });
      setUser(data);
      setToken(activeToken);
      setDemoMode(false);
      return data;
    } catch {
      setStoredToken(null);
      setUser(null);
      setToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const stored = getStoredToken();
      if (!stored) {
        if (active) {
          setDemoMode(isDemoModeEnabled());
          setLoading(false);
        }
        return;
      }
      try {
        const { data } = await apiRequest<AuthUser>('/api/auth/me', { token: stored });
        if (active) {
          setUser(data);
          setToken(stored);
          setDemoMode(false);
        }
      } catch {
        setStoredToken(null);
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiRequest<{ user: AuthUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      token: null,
    });
    setStoredToken(data.token);
    setDemoModeEnabled(false);
    setToken(data.token);
    setUser(data.user);
    setDemoMode(false);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    const activeToken = getStoredToken();
    if (activeToken) {
      try {
        await apiRequest('/api/auth/logout', { method: 'POST', token: activeToken });
      } catch {
        // Always clear local session even if token already expired.
      }
    }
    setStoredToken(null);
    setDemoModeEnabled(false);
    setToken(null);
    setUser(null);
    setDemoMode(false);
  }, []);

  const enableDemoMode = useCallback(() => {
    setStoredToken(null);
    setDemoModeEnabled(true);
    setToken(null);
    setUser(null);
    setDemoMode(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, demoMode, login, logout, refreshUser, enableDemoMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
