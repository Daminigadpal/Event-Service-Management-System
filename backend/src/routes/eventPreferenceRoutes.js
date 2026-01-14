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
  .get(getEventPreferences)
  .post(createEventPreference)
  .put(updateEventPreferences);

// Admin route to get all event preferences
router.get('/all', getAllEventPreferences);

module.exports = router;