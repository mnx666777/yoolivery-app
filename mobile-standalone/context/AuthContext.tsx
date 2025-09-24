import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from '../utils/storage';
import { apiService } from '../services/api';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dob?: string; // YYYY-MM-DD
  aadhaarLast4?: string; // last 4 digits only
};

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  register: (data: Omit<UserProfile, 'id'> & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (update: Partial<UserProfile>) => Promise<void>;
};

type StoredUser = UserProfile & { password: string };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await loadJson<string | null>('auth.token', null);
        if (token) {
          apiService.setToken(token);
          const response = await apiService.getProfile();
          setUser(response.user);
        }
      } catch (error) {
        // Token might be invalid, clear it
        await saveJson('auth.token', null);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    saveJson('auth.currentUser', user);
  }, [user]);

  const register = async (data: Omit<UserProfile, 'id'> & { password: string }) => {
    try {
      const response = await apiService.register(data);
      apiService.setToken(response.token);
      setUser(response.user);
      await saveJson('auth.token', response.token);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      apiService.setToken(response.token);
      setUser(response.user);
      await saveJson('auth.token', response.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    apiService.setToken(null);
    setUser(null);
    await saveJson('auth.token', null);
  };

  const updateProfile = async (update: Partial<UserProfile>) => {
    try {
      const response = await apiService.updateProfile(update);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, updateProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


