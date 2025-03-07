
import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/config';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-f1-red z-10"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-f1-red z-10"></div>

      {/* Speed lines */}
      <div className="fixed w-full pointer-events-none overflow-hidden z-10">
        <div className="speed-line top-[20%] w-[70%]"></div>
        <div className="speed-line top-[40%] w-[85%]"></div>
        <div className="speed-line top-[60%] w-[60%]"></div>
        <div className="speed-line top-[80%] w-[75%]"></div>
      </div>

      <header 
        className="bg-cover bg-center" 
        style={{ backgroundImage: 'url("https://i.imgur.com/cSXNrED.png")' }}
      >
        <Navbar />
      </header>
      
      <main className={`flex-1 ${isAdmin ? 'container mx-auto px-4 py-8' : ''}`}>
        {children}
      </main>
      
      <footer className="bg-gray-800 bg-opacity-90 text-white p-4 text-center relative z-10">
        <div className="container mx-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} F1 New Age Tournament. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
