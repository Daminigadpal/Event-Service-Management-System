import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle multiple role options for staff routes
  if (role === 'staff' && !['staff', 'event_manager'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Handle single role requirements
  if (role && role !== 'staff' && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;