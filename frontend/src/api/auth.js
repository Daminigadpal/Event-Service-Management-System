// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

// Set up axios defaults
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Register user
const register = async (userData) => {
  try {
    console.log('Sending registration request with data:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Registration response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Registration API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Logout user
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setAuthToken(null);
    localStorage.removeItem('user');
  }
};

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }
  return false;
};

// Initialize auth token from localStorage
const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

// Initialize auth when the module loads
initAuth();

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  setAuthToken
};

export default authService;