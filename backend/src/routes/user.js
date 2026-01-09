// backend/src/routes/user.js
import express from 'express';
import {
  createUser,
  updateProfile,
  getProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User profile routes (protected)
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin only routes
router.use(protect, authorize('admin'));
router.route('/').post(createUser);

export default router;