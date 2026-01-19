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

// Unprotected route for testing (must be before protection)
router.route('/all').get(getUsers);

// User profile routes (protected)
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin only routes
router.use(protect, authorize('admin'));
router.route('/')
  .get(getUsers)
  .post(createUser);
router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;