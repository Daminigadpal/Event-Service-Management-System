const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  logout
} = require('../controllers/authController');
const { protect } = require('../src/middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - these require a valid JWT token
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;