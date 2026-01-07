// frontend/src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import authService from '../api/auth';

const PrivateRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;