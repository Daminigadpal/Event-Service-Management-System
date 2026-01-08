const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

// All routes below are protected and require authentication
router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;