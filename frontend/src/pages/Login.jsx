// In frontend/src/pages/Login.jsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      console.log('Sending login request with:', { email, password });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, data: userData } = response.data;
      
      console.log('Calling login with token and userData:', { token, userData });
      login({ token, userData });
      
      console.log('Login success:', true);
      console.log('User data from response:', userData);
      
      // Navigate based on user role
      if (userData.role === 'admin') {
        console.log('Navigating to admin dashboard');
        navigate('/admin/dashboard', {replace:true});
      } else if (userData.role === 'event_manager' || userData.role === 'staff') {
        console.log('Navigating to staff dashboard');
        navigate('/staff/dashboard', {replace:true});
      } else {
        console.log('Navigating to user dashboard');
        navigate('/dashboard', {replace:true});
      }
      console.log('Navigation called');
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;