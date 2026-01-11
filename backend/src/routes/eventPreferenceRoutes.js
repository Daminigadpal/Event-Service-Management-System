// backend/src/routes/eventPreferenceRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth.js');
const {
  getEventPreferences,
  createEventPreference,
  updateEventPreferences
} = require('../controllers/eventPreferenceController.js');

const router = express.Router();

router
  .route('/')
  .get(protect, getEventPreferences)
  .post(protect, createEventPreference)
  .put(protect, updateEventPreferences);

module.exports = router;