
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockKeyhole, UserPlus } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isRoot } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from the location state, or default to home
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  if (isAuthenticated) {
    return null; // Redirect will happen due to useEffect
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <LockKeyhole className="h-12 w-12 text-f1-red" />
            </div>
            <CardTitle className="text-2xl">F1 New Age Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the tournament dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4">
                For demo: Use "admin" / "f1admin" for admin access or "root" / "f1root" for root access
              </p>
              {isRoot && (
                <div className="text-center mt-4">
                  <Link to="/accounts" className="text-sm text-f1-red hover:underline">
                    Manage Accounts
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
