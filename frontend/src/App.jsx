import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import UserDashboard from "./pages/customer/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";  // Make sure this matches the file name

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/admin/dashboard" element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/staff/dashboard" element={
        <PrivateRoute role="staff">
          <StaffDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/customer/UserDashboard" element={
        <PrivateRoute role="customer">
          <UserDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
