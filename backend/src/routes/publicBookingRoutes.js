// backend/src/routes/publicBookingRoutes.js - Unprotected booking routes
const express = require('express');
const { getAllBookings } = require('../controllers/bookingController.js');

const router = express.Router();

// Unprotected route for getting all bookings (for testing/admin dashboard)
router.route('/').get(getAllBookings);

module.exports = router;
