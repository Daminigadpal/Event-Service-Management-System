// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

// Mock user data for testing without MongoDB
const mockUsers = [
  {
    _id: '69607e6cc3465f9a8169107d',
    name: 'Ram',
    email: 'ram@gmail.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'ram123' hashed
    role: 'user'
  }
];

export const protect = async (req, res, next) => {
  let token;

  try {
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if no token
    if (!token) {
      console.log('No token provided');
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      // For mock authentication, check if user ID matches our mock user
      if (decoded.id === '69607e6cc3465f9a8169107d') {
        // Use mock user
        req.user = mockUsers[0];
        next();
        return;
      }
      
      // Get user from the token (for real JWT tokens)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('No user found with id:', decoded.id);
        return next(new ErrorResponse('User not found', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ErrorResponse('User not authenticated', 401));
      }
      
      if (!roles.includes(req.user.role)) {
        console.log(`User role ${req.user.role} not in allowed roles:`, roles);
        return next(
          new ErrorResponse(
            `User role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return next(new ErrorResponse('Authorization error', 500));
    }
  };
};