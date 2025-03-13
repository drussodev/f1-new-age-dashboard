
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Red trim accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-f1-red"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-f1-red"></div>
      
      {/* F1 car silhouette */}
      <div className="absolute opacity-5 pointer-events-none">
        <svg width="800" height="400" viewBox="0 0 1200 600" className="text-white">
          <path fill="currentColor" d="M1100,300 C1050,200 950,150 850,150 L400,150 C300,150 200,250 150,300 C100,350 50,400 0,400 L0,450 L1200,450 L1200,400 C1150,400 1150,400 1100,300 Z"></path>
          <circle fill="currentColor" cx="250" cy="450" r="60"></circle>
          <circle fill="currentColor" cx="900" cy="450" r="60"></circle>
        </svg>
      </div>
      
      {/* Speed lines */}
      <div className="fixed w-full pointer-events-none overflow-hidden">
        <div className="speed-line top-[20%] w-[70%]"></div>
        <div className="speed-line top-[40%] w-[85%]"></div>
        <div className="speed-line top-[60%] w-[60%]"></div>
        <div className="speed-line top-[80%] w-[75%]"></div>
      </div>
      
      <div className="max-w-md w-full z-10">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-extrabold text-white">
            F1 New Age <span className="text-f1-red">Tournament</span>
          </h1>
          <h2 className="mt-6 text-center text-xl font-bold text-white">
            Maintenance Mode
          </h2>
        </div>
        
        <div className="mb-8">
          <AspectRatio ratio={16 / 9} className="bg-slate-800 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1514446557487-94a6fb6b2474?w=800&h=450&q=80" 
              alt="F1 car" 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        
        <Card className="border-gray-700 bg-gray-800/80 backdrop-blur-sm text-white">
          <CardHeader>
            <CardTitle className="text-center">Under Maintenance</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              We're working on improving the F1 tournament experience. Please enter the password to access the site.
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

        <div className="mt-8 flex justify-center gap-4">
          <div className="w-24 h-12 bg-white/5 backdrop-blur-sm rounded-md p-2 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1617811993423-a91607933404?w=80&h=40&q=80&fit=crop" 
              alt="Ferrari" 
              className="max-h-full object-contain"
            />
          </div>
          <div className="w-24 h-12 bg-white/5 backdrop-blur-sm rounded-md p-2 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1615767268442-8430732de2c9?w=80&h=40&q=80&fit=crop" 
              alt="McLaren" 
              className="max-h-full object-contain"
            />
          </div>
          <div className="w-24 h-12 bg-white/5 backdrop-blur-sm rounded-md p-2 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1603571661519-5adef97aeab3?w=80&h=40&q=80&fit=crop" 
              alt="Mercedes" 
              className="max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
