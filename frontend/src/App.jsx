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
    const checkAuth = async () => {
      try {
        // Check if we have a valid token
        if (authService.isAuthenticated()) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      // Ensure we clear the auth state even if the server call fails
      authService.logout();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
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
      path: '/dashboard/*',
      element: (
        <PrivateRoute>
          <Dashboard onLogout={handleLogout} />
        </PrivateRoute>
      ),
    },
    // Add a catch-all route for 404s
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;