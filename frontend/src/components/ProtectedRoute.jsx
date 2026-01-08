import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;