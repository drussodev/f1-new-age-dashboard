
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useF1Data } from '../../context/F1DataContext';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Users, Calendar, Settings, LogIn, LogOut, UserCircle, Newspaper, Twitch, UserPlus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { config } = useF1Data();
  const { user, isAdmin, isRoot, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <NavLink to="/streaming" active={isActive('/streaming')}>
              <Twitch className="w-5 h-5 mr-1" />
              <span>Streaming</span>
            </NavLink>
            <NavLink to="/apply" active={isActive('/apply')}>
              <UserPlus className="w-5 h-5 mr-1" />
              <span>Apply</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/config" active={isActive('/config')}>
                <Settings className="w-5 h-5 mr-1" />
                <span>Config</span>
              </NavLink>
            )}
            {isRoot && (
              <NavLink to="/accounts" active={isActive('/accounts')}>
                <UserCircle className="w-5 h-5 mr-1" />
                <span>Accounts</span>
              </NavLink>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs ml-1 text-gray-500">({user.role})</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
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

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-f1-red text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileMenu: React.FC = () => {
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
          <NavItem to="/streaming" active={isActive('/streaming')} onClick={closeMenu}>
            <Twitch className="w-5 h-5 mr-2" />
            Streaming
          </NavItem>
          <NavItem to="/apply" active={isActive('/apply')} onClick={closeMenu}>
            <UserPlus className="w-5 h-5 mr-2" />
            Apply
          </NavItem>
          {isAdmin && (
            <NavItem to="/config" active={isActive('/config')} onClick={closeMenu}>
              <Settings className="w-5 h-5 mr-2" />
              Config
            </NavItem>
          )}
          {isRoot && (
            <NavItem to="/accounts" active={isActive('/accounts')} onClick={closeMenu}>
              <UserCircle className="w-5 h-5 mr-2" />
              Accounts
            </NavItem>
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

interface NavItemProps {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, active, onClick, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm ${
        active 
          ? 'bg-f1-red text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
