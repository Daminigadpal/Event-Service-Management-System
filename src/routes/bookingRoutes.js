// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const advancedResults = require('../../middleware/advancedResults');

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Booking routes are working!' });
});

// Booking routes
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;