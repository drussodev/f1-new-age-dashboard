
import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/config';
  const isIndex = location.pathname === '/' || location.pathname === '/index';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-f1-red"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-f1-red"></div>

      {/* Speed lines */}
      <div className="fixed w-full pointer-events-none overflow-hidden">
        <div className="speed-line top-[20%] w-[70%]"></div>
        <div className="speed-line top-[40%] w-[85%]"></div>
        <div className="speed-line top-[60%] w-[60%]"></div>
        <div className="speed-line top-[80%] w-[75%]"></div>
      </div>

      {/* F1 Wallpaper - only shown on index page */}
      {isIndex && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=2000')",
          }}
          id="f1-wallpaper"
        ></div>
      )}

      <Navbar />
      
      <main className={`flex-1 ${isAdmin ? 'container mx-auto px-4 py-8' : ''} relative z-10`}>
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center relative z-10">
        <div className="container mx-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} F1 New Age Tournament. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
