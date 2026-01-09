// backend/src/routes/eventPreferenceRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getEventPreferences,
  createEventPreference,
  updateEventPreferences
} from '../controllers/eventPreferenceController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getEventPreferences)
  .post(protect, createEventPreference)
  .put(protect, updateEventPreferences);

export default router;