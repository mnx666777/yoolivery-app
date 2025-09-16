import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from '../utils/storage';

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
      const current = await loadJson<UserProfile | null>('auth.currentUser', null);
      setUser(current);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    saveJson('auth.currentUser', user);
  }, [user]);

  const register = async (data: Omit<UserProfile, 'id'> & { password: string }) => {
    const users = await loadJson<Record<string, StoredUser>>('auth.users', {});
    const exists = Object.values(users).some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw new Error('Email already registered');
    // Age validation: 21+
    if (data.dob) {
      const today = new Date();
      const dob = new Date(data.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 21) throw new Error('You must be at least 21 years old');
    } else {
      throw new Error('Date of birth is required');
    }
    if (!data.aadhaarLast4 || !/^\d{4}$/.test(data.aadhaarLast4)) {
      throw new Error('Enter last 4 digits of Aadhaar');
    }
    const id = 'u_' + Math.random().toString(36).slice(2);
    const stored: StoredUser = { id, name: data.name, email: data.email, phone: data.phone, address: data.address, dob: data.dob, aadhaarLast4: data.aadhaarLast4, password: data.password };
    users[id] = stored;
    await saveJson('auth.users', users);
    setUser({ id, name: stored.name, email: stored.email, phone: stored.phone, address: stored.address });
  };

  const login = async (email: string, password: string) => {
    const users = await loadJson<Record<string, StoredUser>>('auth.users', {});
    const found = Object.values(users).find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return false;
    setUser({ id: found.id, name: found.name, email: found.email, phone: found.phone, address: found.address });
    return true;
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = async (update: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...update };
      (async () => {
        const users = await loadJson<Record<string, StoredUser>>('auth.users', {});
        const u = users[next.id];
        if (u) {
          users[next.id] = { ...u, ...next } as StoredUser;
          await saveJson('auth.users', users);
        }
      })();
      return next;
    });
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, updateProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


