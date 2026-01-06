const express = require('express');
const { auth: protect, admin: authorize } = require('../middleware/auth');
const {
  createPayment,
  getPayments
} = require('../controllers/paymentController');
const Payment = require('../models/Payment');  // Add this line

const router = express.Router();

// POST /api/payments (protected route)
router.post('/', protect, createPayment);

// GET /api/payments (admin only)
router.get('/', protect, authorize, getPayments);

// Update payment status
router.put('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;