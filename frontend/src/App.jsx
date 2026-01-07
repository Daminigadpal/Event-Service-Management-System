// frontend/src/App.jsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import authService from './api/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      authService.setAuthToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: '/login',
      element: !isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      path: '/register',
      element: !isAuthenticated ? (
        <Register onRegister={handleLogin} />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      element: <PrivateRoute isAuthenticated={isAuthenticated} />,
      children: [
        {
          path: '/dashboard/*',
          element: <Dashboard onLogout={handleLogout} />,
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;