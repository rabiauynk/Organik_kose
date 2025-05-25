
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('organikKoseUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      const user = {
        id: response.id?.toString() || '1',
        email: response.email,
        name: response.name,
        isAdmin: response.role === 'ADMIN'
      };
      setUser(user);
      localStorage.setItem('organikKoseUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await apiService.register({
        email,
        password,
        name,
        phone: '',
        address: ''
      });
      const user = {
        id: response.id?.toString() || '1',
        email: response.email,
        name: response.name,
        isAdmin: response.role === 'ADMIN'
      };
      setUser(user);
      localStorage.setItem('organikKoseUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('organikKoseUser');
    localStorage.removeItem('organikKoseToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.isAdmin || false,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
