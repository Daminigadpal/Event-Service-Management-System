// backend/src/routes/eventPreferenceRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getEventPreferences,
  updateEventPreferences
} from '../controllers/eventPreferenceController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getEventPreferences)
  .put(protect, updateEventPreferences);

export default router;