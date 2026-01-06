const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/async');

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res) => {
  const { booking, amount, paymentMethod, status } = req.body;

  // Check if booking exists
  const bookingExists = await Booking.findById(booking);
  if (!bookingExists) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Create payment
  const payment = await Payment.create({
    booking,
    amount,
    paymentMethod,
    status,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('booking', 'date status');
  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});