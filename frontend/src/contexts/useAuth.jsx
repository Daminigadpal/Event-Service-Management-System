// frontend/src/contexts/useAuth.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Login function
// frontend/src/contexts/useAuth.jsx
const login = useCallback(async (email, password) => {
  try {
    setLoading(true);
    console.log('Attempting login with:', { email });
    
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This is important for cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // The token is in an HTTP-only cookie, so we don't need to handle it here
    setUser(data.user);
    setIsAuthenticated(true);
    navigate('/customer/dashboard');
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}, [navigate]);
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
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

  // Add updateUserProfile function
  const updateUserProfile = async (profileData) => {
    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is important for cookies
        body: JSON.stringify(profileData),
      });
      
      // Update local user state
      const currentUser = context.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...profileData };
        context.setUser(updatedUser);
      }
      
      return response.json();
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return { ...context, updateUserProfile };
};