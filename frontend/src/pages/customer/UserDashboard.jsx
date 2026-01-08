import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, your role is: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
