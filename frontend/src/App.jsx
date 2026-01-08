// frontend/src/App.jsx
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import auth from './api/auth';  // Make sure this import exists

// Lazy load components
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.default })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.default })));
const UserDashboard = lazy(() => import('./pages/customer/UserDashboard').then(module => ({ default: module.default })));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add authentication check on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await auth.getMe();
          setUser(userData.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Add handleLogin function
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', userData.token);
  };

  // Add handleLogout function
  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
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
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/customer/dashboard" replace />
                  )
                }
              />
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <UserDashboard user={user} onLogout={handleLogout} />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? '/customer/dashboard' : '/login'} replace />
                }
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;