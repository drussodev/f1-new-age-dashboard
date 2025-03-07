
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireRoot?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireRoot = false
}) => {
  const { isAuthenticated, isAdmin, isRoot } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If root is required but user is not root, redirect to home
  if (requireRoot && !isRoot) {
    return <Navigate to="/" replace />;
  }

  // If admin is required but user is not admin or root, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
