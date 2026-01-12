// backend/src/routes/staffAvailabilityRoutes.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth.js');
const {
  getStaffAvailability,
  setStaffAvailability,
  checkBookingConflicts,
  getDailySchedule,
  deleteStaffAvailability
} = require('../controllers/staffAvailabilityController.js');

const router = express.Router();

// All routes are protected
router.use(protect);

// Staff availability management
router
  .route('/')
  .get(getStaffAvailability)
  .post(authorize(['admin', 'staff'], 'staff'), setStaffAvailability);

// Conflict checking
router.post('/check-conflicts', checkBookingConflicts);

// Daily schedule view
router.get('/schedule/:date', protect, getDailySchedule);

// Delete availability
router.delete('/:id', deleteStaffAvailability);

module.exports = router;
