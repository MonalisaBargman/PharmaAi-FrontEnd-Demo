import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../types';
import { EMPTY_USER_PROFILE } from '../constants';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Note: credentials are hardcoded for demo account
const DEMO_EMAIL = 'monalisabargman58@gmail.com';
const DEMO_PASSWORD = 'Pass123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('demo_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // simple synchronous check, mimicking async API
    await new Promise((r) => setTimeout(r, 200));
    let success = false;
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser(EMPTY_USER_PROFILE);
      success = true;
    }
    setLoading(false);
    return success;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updated: UserProfile) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};