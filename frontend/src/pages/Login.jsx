import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(formData);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="signup-link" style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account?{' '}
        <a href="/register" style={{ color: '#4CAF50', textDecoration: 'none' }} onClick={(e) => {
          e.preventDefault();
          navigate('/register');
        }}>Sign Up</a>
      </div>
    </div>
  );
};

export default Login;