import express from 'express';
const router = express.Router();
import { register, login, getMe, updateDetails } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

export default router;