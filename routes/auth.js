const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('./../src/controllers/authController');
const { protect } = require('./../src/middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.get('/logout', logout);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);

module.exports = router;
