// frontend/src/components/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;