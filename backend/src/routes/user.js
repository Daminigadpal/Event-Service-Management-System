// backend/src/routes/user.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile  // Make sure to import the updateProfile controller
} from '../controllers/userController.js';

const router = express.Router();

// Profile route - must be defined before the admin middleware
router.put('/profile', protect, updateProfile);

// All routes below this line are protected and only accessible by admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;