import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import UserDashboard from "./pages/customer/UserDashboard";
import BookingList from './pages/booking/BookingList';
import BookingDetail from './pages/booking/BookingDetail';
import CreateBooking from './pages/booking/CreateBooking';

// Scheduling Components
import AvailabilityCalendar from './components/scheduling/AvailabilityCalendar';
import ScheduleView from './components/scheduling/ScheduleView';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Dashboard */}
      <Route 
        path="/admin/dashboard" 
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Staff Dashboard */}
      <Route 
        path="/staff/dashboard" 
        element={
          <PrivateRoute role="staff">
            <StaffDashboard />
          </PrivateRoute>
        } 
      />
      
      {/* User Dashboard (alternative path) */}
      <Route 
        path="/customer/userdashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Booking Routes */}
      <Route 
        path="/bookings" 
        element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/bookings/new" 
        element={
          <PrivateRoute>
            <CreateBooking />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/bookings/:id" 
        element={
          <PrivateRoute>
            <BookingDetail />
          </PrivateRoute>
        } 
      />
      
      {/* Scheduling Routes */}
      <Route 
        path="/scheduling/calendar" 
        element={
          <PrivateRoute>
            <AvailabilityCalendar />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/scheduling/schedule" 
        element={
          <PrivateRoute>
            <ScheduleView />
          </PrivateRoute>
        } 
      />
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;