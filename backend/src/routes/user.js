// backend/src/routes/user.js
const express = require('express');
const {
  createUser,
  updateProfile,
  getProfile,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController.js');
const { protect, authorize } = require("../middleware/auth.js");

const router = express.Router();

// User profile routes (protected - users can only access their own profile)
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin only routes - only admins can access all user data
router.use(protect, authorize('admin'));
router.route('/')
  .get(getUsers)
  .post(createUser);
router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;