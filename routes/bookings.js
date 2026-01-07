const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getBookings, 
  createBooking, 
  getBooking, 
  updateBooking, 
  deleteBooking 
} = require('../src/controllers/bookingController');
const { protect, authorize } = require('../src/middleware/auth');
const advancedResults = require('../../middleware/advancedResults');
const Booking = require('../src/models/Booking');

router.route('/')
  .get(
    protect,
    advancedResults(Booking, [
      { path: 'service', select: 'name price' },
      { path: 'user', select: 'name email' }
    ]),
    getBookings
  )
  .post(protect, authorize('user', 'admin'), createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, authorize('user', 'admin'), updateBooking)
  .delete(protect, authorize('user', 'admin'), deleteBooking);

module.exports = router;
