// backend/src/routes/booking.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  sendQuote,
  confirmBooking,
  assignStaffToBooking,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all bookings or create new
router.route('/')
  .get(getBookings)
  .post(createBooking);

// Get, update, or delete specific booking
router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

// Booking status management
router.put('/:id/quote', authorize('admin'), sendQuote);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/status', authorize('admin'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

// Staff assignment
router.put('/:id/assign-staff', authorize('admin'), assignStaffToBooking);

export default router;