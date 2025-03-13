
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const MaintenancePage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Check if user was previously authorized
  useEffect(() => {
    const authorized = localStorage.getItem('maintenance_authorized');
    if (authorized === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'drussoelindo') {
      localStorage.setItem('maintenance_authorized', 'true');
      setIsAuthorized(true);
      toast.success('Access granted!');
      
      // Reload the page to render the full app
      window.location.reload();
    } else {
      toast.error('Incorrect password');
    }
  };

  if (isAuthorized) {
    return null; // Will render the actual app (handled in App.tsx)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-f1-red"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-f1-red"></div>
      
      {/* Speed lines */}
      <div className="fixed w-full pointer-events-none overflow-hidden">
        <div className="speed-line top-[20%] w-[70%]"></div>
        <div className="speed-line top-[40%] w-[85%]"></div>
        <div className="speed-line top-[60%] w-[60%]"></div>
        <div className="speed-line top-[80%] w-[75%]"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-white">
            F1 New Age <span className="text-f1-red">Tournament</span>
          </h1>
          <h2 className="mt-6 text-center text-xl font-bold text-white">
            Maintenance Mode
          </h2>
        </div>
        
        <Card className="border-gray-700 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-center">Under Maintenance</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              We're working on improving the experience. Please enter the password to access the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-f1-red hover:bg-f1-dark">
                Access Site
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} F1 New Age Tournament
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MaintenancePage;
