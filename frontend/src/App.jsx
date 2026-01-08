// frontend/src/App.jsx
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider, 
  Route, 
  Navigate,
  Outlet  // Add this import
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/useAuth';

// Import components
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/customer/UserDashboard';

// Layout component
const Layout = () => {
  return (
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
      <Outlet /> {/* This was causing the error */}
    </div>
  );
};

// Create router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <AuthProvider>
    <Route
      element={
        <AuthProvider>
          <Layout />
        </AuthProvider>
      }
      errorElement={<ErrorBoundary />}
    >
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/customer/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        index
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Route>
    </AuthProvider>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_throwAbortReason: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;