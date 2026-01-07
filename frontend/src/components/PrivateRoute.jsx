// frontend/src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;