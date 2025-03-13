
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockKeyhole, UserPlus, Trash2, Shield } from 'lucide-react';
import { sendWebhookNotification } from '../utils/webhook';
import { toast } from 'sonner';

const AccountsManagement = () => {
  const { accounts, addAccount, removeAccount, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'root'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoading(true);
      try {
        const success = await addAccount({ username, password, role });
        
        if (success && user) {
          sendWebhookNotification(
            "Account Created", 
            user.username, 
            { 
              action: "Created new account via management page",
              newUsername: username,
              role: role
            }
          );
          
          setUsername('');
          setPassword('');
          setRole('user');
        }
      } catch (error) {
        console.error("Error adding account:", error);
        toast.error("Failed to add account");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveAccount = async (username: string) => {
    if (user?.username === username) {
      return;
    }
    
    const accountToRemove = accounts.find(acc => acc.username === username);
    if (!accountToRemove) return;
    
    setIsRemoving(username);
    try {
      const success = await removeAccount(username);
      
      if (success && user) {
        sendWebhookNotification(
          "Account Removed", 
          user.username, 
          { 
            action: "Removed account via management page",
            removedUsername: username,
            removedRole: accountToRemove.role
          }
        );
      }
    } catch (error) {
      console.error("Error removing account:", error);
      toast.error("Failed to remove account");
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-f1-red" />
                <CardTitle className="text-2xl">Add New Account</CardTitle>
              </div>
              <CardDescription>
                Create new accounts for users, admins, or root users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'user' | 'root')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="root">Root</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                      Adding Account...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-f1-red" />
                <CardTitle className="text-xl">Existing Accounts</CardTitle>
              </div>
              <CardDescription>
                Manage existing user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.username} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{account.username}</p>
                      <p className="text-sm text-gray-500">
                        Role: <span className={`
                          ${account.role === 'root' ? 'text-red-600 font-semibold' : ''}
                          ${account.role === 'admin' ? 'text-blue-600 font-medium' : ''}
                          ${account.role === 'user' ? 'text-gray-600' : ''}
                        `}>
                          {account.role}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAccount(account.username)}
                      disabled={user?.username === account.username || isRemoving === account.username}
                      title={user?.username === account.username ? "Cannot remove your own account" : "Remove account"}
                    >
                      {isRemoving === account.username ? (
                        <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-center">
              {user?.username} logged in as {user?.role}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AccountsManagement;
