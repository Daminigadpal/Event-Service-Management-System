// backend/src/routes/staffAvailabilityRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getStaffAvailability,
  setStaffAvailability,
  checkBookingConflicts,
  getDailySchedule,
  deleteStaffAvailability
} from '../controllers/staffAvailabilityController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Staff availability management
router
  .route('/')
  .get(getStaffAvailability)
  .post(authorize('admin', 'staff'), setStaffAvailability);

// Conflict checking
router.post('/check-conflicts', checkBookingConflicts);

// Daily schedule view
router.get('/schedule/:date', getDailySchedule);

// Delete availability
router.delete('/:id', deleteStaffAvailability);

export default router;
