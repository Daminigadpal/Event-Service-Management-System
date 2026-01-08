// frontend/src/pages/customer/UserDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout from useAuth

  console.log('UserDashboard - User from context:', user);

  if (!user) {
    console.log('No user, redirecting to login...');
    navigate('/login');
    return <div>Redirecting to login...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Welcome, {user?.name || 'User'}</h1>
      <p>Dashboard is working!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserDashboard;