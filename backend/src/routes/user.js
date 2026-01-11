// backend/src/routes/user.js
const express = require('express');
const {
  createUser,
  updateProfile,
  getProfile,
  getUsers
} = require('../controllers/userController.js');
const { protect, authorize } = require("../middleware/auth.js");

const router = express.Router();

// User profile routes (protected)
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin only routes
router.use(protect, authorize('admin'));
router.route('/').post(createUser);

module.exports = router;