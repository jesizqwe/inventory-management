import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    console.log('Login response:', response.data);
    const { access_token, user } = response.data;

    if (!access_token) {
      throw new Error('No token received from server');
    }

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(access_token);
    setUser(user);
    console.log('Token saved:', access_token.substring(0, 20) + '...');
  };

  const register = async (email: string, name: string, password: string) => {
    const response = await authApi.register(email, name, password);
    console.log('Register response:', response.data);
    const { access_token, user } = response.data;

    if (!access_token) {
      throw new Error('No token received from server');
    }

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(access_token);
    setUser(user);
    console.log('Token saved after register:', access_token.substring(0, 20) + '...');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, isAdmin }}>
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
