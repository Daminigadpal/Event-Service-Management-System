const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getCustomers,
  getCustomer,
  getMyProfile,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addPreference,
  addNote,
  markAsRepeat,
  getCustomerBookings
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Customer = require('../models/Customer');

// All routes are protected
router.use(protect);

// Get logged in customer's profile
router.get('/me', getMyProfile);

// Admin only routes
router.use(authorize('admin'));

// Base routes
router
  .route('/')
  .get(
    advancedResults(Customer, [
      { path: 'user', select: 'name email' },
      { path: 'communicationNotes.createdBy', select: 'name' }
    ]),
    getCustomers
  )
  .post(createCustomer);

// Routes with ID parameter
router
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

// Customer preferences
router.route('/:id/preferences').post(addPreference);

// Customer communication notes
router.route('/:id/notes').post(addNote);

// Mark customer as repeat
router.route('/:id/mark-repeat').put(markAsRepeat);

// Get customer's booking history
router.route('/:id/bookings').get(getCustomerBookings);

module.exports = router;
