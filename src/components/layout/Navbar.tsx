
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useF1Data } from '../../context/F1DataContext';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Users, Calendar, Settings, LogIn, UserCircle, Newspaper, FileText } from 'lucide-react';
import { NavLink } from '../navigation/NavLink';
import { MobileMenu } from '../navigation/MobileMenu';
import { UserInfo } from '../navigation/UserInfo';

export const Navbar: React.FC = () => {
  const { config } = useF1Data();
  const { user, isAdmin, isRoot } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-f1-red" />
            <div>
              <h1 className="font-bold text-xl leading-none">{config.title}</h1>
              <p className="text-xs text-gray-500">{config.season} Season</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={isActive('/')}>
              <Trophy className="w-5 h-5 mr-1" />
              <span>Standings</span>
            </NavLink>
            <NavLink to="/drivers" active={isActive('/drivers')}>
              <Users className="w-5 h-5 mr-1" />
              <span>Drivers</span>
            </NavLink>
            <NavLink to="/calendar" active={isActive('/calendar')}>
              <Calendar className="w-5 h-5 mr-1" />
              <span>Calendar</span>
            </NavLink>
            <NavLink to="/news" active={isActive('/news')}>
              <Newspaper className="w-5 h-5 mr-1" />
              <span>News</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/config" active={isActive('/config')}>
                <Settings className="w-5 h-5 mr-1" />
                <span>Config</span>
              </NavLink>
            )}
            {isRoot && (
              <>
                <NavLink to="/accounts" active={isActive('/accounts')}>
                  <UserCircle className="w-5 h-5 mr-1" />
                  <span>Accounts</span>
                </NavLink>
                <NavLink to="/logs" active={isActive('/logs')}>
                  <FileText className="w-5 h-5 mr-1" />
                  <span>Logs</span>
                </NavLink>
              </>
            )}
            
            {user ? (
              <UserInfo />
            ) : (
              <NavLink to="/login" active={isActive('/login')}>
                <LogIn className="w-5 h-5 mr-1" />
                <span>Login</span>
              </NavLink>
            )}
          </nav>
          
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
