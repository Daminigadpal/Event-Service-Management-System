// frontend/src/App.jsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import { getMe, logout as apiLogout } from './api/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getMe();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
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
        <Register />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      path: '/dashboard/*',
      element: (
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <Dashboard user={user} onLogout={handleLogout} />
        </PrivateRoute>
      ),
    },
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