import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, saveToken, clearToken, isAuthenticated } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  career_goal: string;
  location: string;
  streak_days: number;
  total_xp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch {
      clearToken();
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    saveToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    saveToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  // Instantly update the local user state (for Settings page)
  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  // Re-fetch from server (e.g. after profile changes)
  const refreshUser = async () => {
    if (isAuthenticated()) {
      await fetchUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
