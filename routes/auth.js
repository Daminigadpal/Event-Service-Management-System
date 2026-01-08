import express from 'express';
import { protect } from '../src/middleware/auth.js';
import { 
  register, 
  login, 
  getMe, 
  logout 
} from '../src/controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;