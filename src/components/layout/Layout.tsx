
import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/config';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-f1-red"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-f1-red"></div>

      {/* Speed lines */}
      <div className="fixed w-full pointer-events-none overflow-hidden">
        <div className="speed-line top-[20%] w-[70%]"></div>
        <div className="speed-line top-[40%] w-[85%]"></div>
        <div className="speed-line top-[60%] w-[60%]"></div>
        <div className="speed-line top-[80%] w-[75%]"></div>
      </div>

      <Navbar />
      
      <main className={`flex-1 ${isAdmin ? 'container mx-auto px-4 py-8' : ''}`}>
        {children}
      </main>
      
      <footer className="bg-secondary text-secondary-foreground p-4 text-center">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; {new Date().getFullYear()} F1 New Age Tournament. All rights reserved.</p>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
};
