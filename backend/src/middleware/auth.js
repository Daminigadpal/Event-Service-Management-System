// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

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
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('No user found with id:', decoded.id);
        return next(new ErrorResponse('No user found with this id', 404));
      }
      
      req.user = user;
      console.log('Authenticated user:', { id: user._id, email: user.email });
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      if (err.name === 'JsonWebTokenError') {
        return next(new ErrorResponse('Invalid token', 401));
      } else if (err.name === 'TokenExpiredError') {
        return next(new ErrorResponse('Token expired', 401));
      }
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return next(new ErrorResponse('Server error', 500));
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