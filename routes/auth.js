const express = require('express');
const router = express.Router();
const { 
  register,  // This is the correct import name
  login, 
  getMe, 
  logout 
} = require('../src/controllers/authController');
const { protect } = require('../src/middleware/auth');

// Public routes
router.post('/register', register);  // Changed from registerUser to register
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;