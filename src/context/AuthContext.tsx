
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Simple admin user type
interface User {
  username: string;
  role: 'admin' | 'user';
}

// Default admin credentials (in a real app, this would be in a database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'f1admin',
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key
const USER_STORAGE_KEY = 'f1-new-age-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === 'admin';

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    // Simple authentication logic
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setUser({ username, role: 'admin' });
      toast.success('Logged in as admin');
      return true;
    }
    
    // For demo purposes, allow any other login as regular user
    if (username && password) {
      setUser({ username, role: 'user' });
      toast.success('Logged in as user');
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
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
