
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// User type with role
interface User {
  username: string;
  role: 'root' | 'admin' | 'user';
}

// Account information stored in local storage
interface Account {
  username: string;
  password: string;
  role: 'root' | 'admin' | 'user';
}

// Log entry for admin actions
export interface LogEntry {
  username: string;
  action: string;
  details: string;
  timestamp: string;
}

// Default admin credentials
const DEFAULT_ACCOUNTS: Account[] = [
  {
    username: 'admin',
    password: 'f1admin',
    role: 'admin',
  },
  {
    username: 'root',
    password: 'f1root',
    role: 'root',
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRoot: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'role'> & { role: 'root' | 'admin' | 'user' }) => boolean;
  removeAccount: (username: string) => boolean;
  logs: LogEntry[];
  addLog: (action: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_STORAGE_KEY = 'f1-new-age-user';
const ACCOUNTS_STORAGE_KEY = 'f1-new-age-accounts';
const LOGS_STORAGE_KEY = 'f1-new-age-logs';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return storedAccounts ? JSON.parse(storedAccounts) : DEFAULT_ACCOUNTS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  });

  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'root');
  const isRoot = !!user && user.role === 'root';

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const login = (username: string, password: string): boolean => {
    // Find account in our accounts list
    const account = accounts.find(
      acc => acc.username === username && acc.password === password
    );
    
    if (account) {
      setUser({ username: account.username, role: account.role });
      toast.success(`Logged in as ${account.role}`);
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out');
  };

  const addAccount = (newAccount: Account): boolean => {
    // Check if username already exists
    if (accounts.some(acc => acc.username === newAccount.username)) {
      toast.error('Username already exists');
      return false;
    }

    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    
    // Log this action if an admin user is performing it
    if (user && isAdmin) {
      addLog(`Added account`, `Created new ${newAccount.role} account: ${newAccount.username}`);
    }
    
    toast.success(`Account ${newAccount.username} created successfully`);
    return true;
  };

  const removeAccount = (username: string): boolean => {
    // Prevent removing the last root account
    const rootAccounts = accounts.filter(acc => acc.role === 'root');
    if (rootAccounts.length === 1 && rootAccounts[0].username === username) {
      toast.error('Cannot remove the last root account');
      return false;
    }

    // Find the account to log the role that was removed
    const accountToRemove = accounts.find(acc => acc.username === username);
    
    setAccounts(prevAccounts => prevAccounts.filter(acc => acc.username !== username));
    
    // Log this action if an admin user is performing it
    if (user && isAdmin && accountToRemove) {
      addLog(`Removed account`, `Deleted ${accountToRemove.role} account: ${username}`);
    }
    
    toast.success(`Account ${username} removed successfully`);
    return true;
  };

  const addLog = (action: string, details: string) => {
    if (!user) return;
    
    const newLog: LogEntry = {
      username: user.username,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      isRoot,
      login, 
      logout, 
      accounts,
      addAccount,
      removeAccount,
      logs,
      addLog
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
