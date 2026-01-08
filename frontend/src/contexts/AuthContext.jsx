// frontend/src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = ({ token, userData }) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

// frontend/src/contexts/AuthContext.jsx
const updateUserProfile = async (profileData) => {
  try {
    console.log('Sending profile update:', profileData);
    const response = await api.put('/users/profile', profileData);
    console.log('Profile update response:', response.data);
    
    setUser(prev => ({
      ...prev,
      ...response.data.data
    }));
    
    toast.success('Profile updated successfully');
    return response.data;
  } catch (error) {
    console.error('Profile update error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    toast.error(error.response?.data?.message || 'Failed to update profile');
    throw error;
  }
};
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        login, 
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};