import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  
  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If a role is specified and the user doesn't have it, redirect to their dashboard or home
  if (role && user.role !== role) {
    switch(user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'staff':
        return <Navigate to="/staff/dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer/UserDashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  // If user is authenticated and has the required role, render the children
  return children;
};

export default PrivateRoute;