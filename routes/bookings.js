// routes/bookings.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { getMyBookings } from '../controllers/bookings.js';

const router = express.Router();

// Protected route (requires authentication)
router.get('/me', protect, getMyBookings);

export default router;