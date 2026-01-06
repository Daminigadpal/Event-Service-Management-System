import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Services = React.lazy(() => import('./pages/Services'));
const BookEvent = React.lazy(() => import('./pages/BookEvent'));
const Deliverables = React.lazy(() => import('./pages/Deliverables'));
const Login = React.lazy(() => import('./components/auth/Login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));

// Loading component with better styling
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-event"
              element={
                <ProtectedRoute>
                  <BookEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deliverables"
              element={
                <ProtectedRoute>
                  <Deliverables />
                </ProtectedRoute>
              }
            />

            {/* Fallback route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </React.Suspense>
    </ErrorBoundary>
  );
}

export default App;
