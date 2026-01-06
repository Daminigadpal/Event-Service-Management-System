import { Navigate } from 'react-router-dom';
import authService from '../api/auth';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = authService.getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;