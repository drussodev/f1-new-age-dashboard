
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { sendWebhookNotification } from '../utils/webhook';

// User type with role
interface AppUser {
  username: string;
  role: 'root' | 'admin' | 'user';
}

// Account information stored in local storage
interface Account {
  username: string;
  password: string;
  role: 'root' | 'admin' | 'user';
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
  user: AppUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRoot: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'role'> & { role: 'root' | 'admin' | 'user' }) => Promise<boolean>;
  removeAccount: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const ACCOUNTS_STORAGE_KEY = 'f1-new-age-accounts';
const CURRENT_USER_KEY = 'f1-new-age-current-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return storedAccounts ? JSON.parse(storedAccounts) : DEFAULT_ACCOUNTS;
  });

  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'root');
  const isRoot = !!user && user.role === 'root';

  // Store the user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // Store accounts in localStorage when they change
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find account in our accounts list
      const account = accounts.find(
        acc => acc.username === username && acc.password === password
      );
      
      if (!account) {
        toast.error('Invalid credentials');
        return false;
      }
      
      setUser({ username: account.username, role: account.role });
      
      // Log admin login to webhook
      if (account.role === 'admin' || account.role === 'root') {
        sendWebhookNotification(
          "Login", 
          account.username, 
          { role: account.role, action: "Logged in to the system" }
        );
      }
      
      toast.success(`Logged in as ${account.role}`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Log admin logout to webhook
      if (user && (user.role === 'admin' || user.role === 'root')) {
        sendWebhookNotification(
          "Logout", 
          user.username, 
          { role: user.role, action: "Logged out of the system" }
        );
      }
      
      setUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
      toast.info('Logged out');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('An error occurred during logout');
    }
  };

  const addAccount = async (newAccount: Account): Promise<boolean> => {
    try {
      // Check if username already exists
      if (accounts.some(acc => acc.username === newAccount.username)) {
        toast.error('Username already exists');
        return false;
      }
  
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
      
      // Log account creation to webhook if admin is logged in
      if (user && (user.role === 'admin' || user.role === 'root')) {
        sendWebhookNotification(
          "Account Created", 
          user.username, 
          { 
            createdUsername: newAccount.username, 
            role: newAccount.role 
          }
        );
      }
      
      toast.success(`Account ${newAccount.username} created successfully`);
      return true;
    } catch (error) {
      console.error("Add account error:", error);
      toast.error('An error occurred while creating the account');
      return false;
    }
  };

  const removeAccount = async (username: string): Promise<boolean> => {
    try {
      // Prevent removing the last root account
      const rootAccounts = accounts.filter(acc => acc.role === 'root');
      if (rootAccounts.length === 1 && rootAccounts[0].username === username) {
        toast.error('Cannot remove the last root account');
        return false;
      }
  
      // Get account info before removing for webhook
      const accountToRemove = accounts.find(acc => acc.username === username);
      if (!accountToRemove) return false;
      
      // Remove from local accounts
      setAccounts(prevAccounts => prevAccounts.filter(acc => acc.username !== username));
      
      // Log account removal to webhook if admin is logged in
      if (user && (user.role === 'admin' || user.role === 'root')) {
        sendWebhookNotification(
          "Account Removed", 
          user.username, 
          { 
            removedUsername: username, 
            removedRole: accountToRemove.role 
          }
        );
      }
      
      toast.success(`Account ${username} removed successfully`);
      return true;
    } catch (error) {
      console.error("Remove account error:", error);
      toast.error('An error occurred while removing the account');
      return false;
    }
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
      removeAccount
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
