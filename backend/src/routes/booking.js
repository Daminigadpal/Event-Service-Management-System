// backend/src/routes/booking.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  assignStaffToBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

// Assign staff to booking
router.put('/:id/assign-staff', assignStaffToBooking);

export default router;