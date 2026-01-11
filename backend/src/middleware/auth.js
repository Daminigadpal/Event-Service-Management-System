// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const ErrorResponse = require('../utils/errorResponse.js');

const protect = async (req, res, next) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      console.log('Decoded token:', decoded);
      
      // Get user from MongoDB
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('No user found with id:', decoded.id);
        return next(new ErrorResponse('User not found', 401));
      }

      // Set user in request
      req.user = user;
      console.log('User authenticated:', user.name, 'Role:', user.role);
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

const authorize = (...roles) => {
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

module.exports = { protect, authorize };