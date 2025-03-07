
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserInfoProps {
  isMobile?: boolean;
}

export const UserInfo: React.FC<UserInfoProps> = ({ isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return isMobile ? null : (
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
  );
};
