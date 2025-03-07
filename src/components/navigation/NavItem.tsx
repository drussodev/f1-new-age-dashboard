
import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({ to, active, onClick, children }) => {
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
