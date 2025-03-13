
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockKeyhole, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { login, isAuthenticated, isRoot } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from the location state, or default to home
  const from = location.state?.from?.pathname || '/';

  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      try {
        // Simple check if we can reach Supabase by fetching a single row
        const { error } = await supabase
          .from('config')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
        } else {
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error('Supabase check failed:', err);
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, []);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await login(username, password);
      if (success) {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    setConnectionStatus('checking');
    // Force page reload to reset connection
    window.location.reload();
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
            {connectionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Database connection error</p>
                  <p className="text-sm mt-1">Cannot connect to the Supabase database. This might be a temporary issue.</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2" 
                    onClick={retryConnection}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Connection
                  </Button>
                </div>
              </div>
            )}
            
            {connectionStatus === 'checking' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-700 border-r-transparent rounded-full"></div>
                <span>Checking database connection...</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
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
                  disabled={isLoading || connectionStatus !== 'connected'}
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
                  disabled={isLoading || connectionStatus !== 'connected'}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || connectionStatus !== 'connected'}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
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
