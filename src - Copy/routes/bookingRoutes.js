const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

router
  .route('/')
  .get(auth, admin, getBookings)
  .post(auth, createBooking);

router.get('/me', auth, getMyBookings);

router
  .route('/:id')
  .put(auth, admin, updateBooking)
  .delete(auth, deleteBooking);

module.exports = router;