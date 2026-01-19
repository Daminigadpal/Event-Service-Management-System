// backend/src/routes/eventPreferenceRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth.js');
const {
  getEventPreferences,
  getAllEventPreferences,
  createEventPreference,
  updateEventPreferences
} = require('../controllers/eventPreferenceController.js');

const router = express.Router();

router
  .route('/')
  .get(protect, getEventPreferences)
  .post(protect, createEventPreference)
  .put(protect, updateEventPreferences);

// Admin route to get all event preferences
router.get('/all', protect, getAllEventPreferences);

module.exports = router;