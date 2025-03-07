
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Users, Calendar, Settings, LogIn, LogOut, UserCircle, Newspaper, FileText } from 'lucide-react';
import { NavItem } from './NavItem';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isRoot, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-gray-100"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        <div className="w-6 h-6 flex flex-col justify-between">
          <span className={`block w-full h-0.5 bg-gray-800 transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`block w-full h-0.5 bg-gray-800 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-full h-0.5 bg-gray-800 transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
          {user && (
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>
          )}
          
          <NavItem to="/" active={isActive('/')} onClick={closeMenu}>
            <Trophy className="w-5 h-5 mr-2" />
            Standings
          </NavItem>
          <NavItem to="/drivers" active={isActive('/drivers')} onClick={closeMenu}>
            <Users className="w-5 h-5 mr-2" />
            Drivers
          </NavItem>
          <NavItem to="/calendar" active={isActive('/calendar')} onClick={closeMenu}>
            <Calendar className="w-5 h-5 mr-2" />
            Calendar
          </NavItem>
          <NavItem to="/news" active={isActive('/news')} onClick={closeMenu}>
            <Newspaper className="w-5 h-5 mr-2" />
            News
          </NavItem>
          {isAdmin && (
            <NavItem to="/config" active={isActive('/config')} onClick={closeMenu}>
              <Settings className="w-5 h-5 mr-2" />
              Config
            </NavItem>
          )}
          {isRoot && (
            <>
              <NavItem to="/accounts" active={isActive('/accounts')} onClick={closeMenu}>
                <UserCircle className="w-5 h-5 mr-2" />
                Accounts
              </NavItem>
              <NavItem to="/logs" active={isActive('/logs')} onClick={closeMenu}>
                <FileText className="w-5 h-5 mr-2" />
                Logs
              </NavItem>
            </>
          )}
          
          {user ? (
            <div
              className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </div>
          ) : (
            <NavItem to="/login" active={isActive('/login')} onClick={closeMenu}>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </NavItem>
          )}
        </div>
      )}
    </div>
  );
};
