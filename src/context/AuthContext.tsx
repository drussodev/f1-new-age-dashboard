
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { sendWebhookNotification } from '../utils/webhook';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return storedAccounts ? JSON.parse(storedAccounts) : DEFAULT_ACCOUNTS;
  });

  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'root');
  const isRoot = !!user && user.role === 'root';

  // Initialize session from Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Find the account that matches the email
          const foundAccount = accounts.find(acc => acc.username === session.user?.email);
          if (foundAccount) {
            setUser({
              username: foundAccount.username,
              role: foundAccount.role
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Find the account that matches the email
        const foundAccount = accounts.find(acc => acc.username === session.user?.email);
        if (foundAccount) {
          setUser({
            username: foundAccount.username,
            role: foundAccount.role
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [accounts]);

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
      
      // First check if the user exists in Supabase
      const { data: existingUsers, error: checkError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });
      
      if (existingUsers.user) {
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
      } else {
        // If user doesn't exist, sign them up
        const { data, error } = await supabase.auth.signUp({
          email: username,
          password: password,
        });
        
        if (error) {
          console.error("Signup error:", error);
          toast.error(error.message);
          return false;
        }
        
        if (data.user) {
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
        }
      }
      
      return false;
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
      
      await supabase.auth.signOut();
      setUser(null);
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
  
      // Add account to Supabase
      const { data, error } = await supabase.auth.signUp({
        email: newAccount.username,
        password: newAccount.password,
      });
  
      if (error) {
        console.error("Account creation error:", error);
        toast.error(error.message);
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
