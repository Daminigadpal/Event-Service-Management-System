const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getPayments, 
  createPayment, 
  getPayment, 
  updatePayment, 
  deletePayment 
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Payment = require('../models/Payment');

// All routes are protected
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(
    advancedResults(Payment, [
      { path: 'booking', select: 'eventDate status' },
      { path: 'user', select: 'name email' }
    ]),
    getPayments
  )
  .post(createPayment);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
