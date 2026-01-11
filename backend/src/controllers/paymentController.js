// backend/src/controllers/paymentController.js
const Payment = require('../models/Payment.js');
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @route   GET /api/v1/payments
// @access  Private
const getPayments = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting payments for user:', req.user.id);

    // Filter payments by user
    const payments = await Payment.find({ user: req.user.id }).sort({ paymentDate: -1 });

    console.log('Found payments:', payments.length);

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Create a new payment
// @route   POST /api/v1/payments
// @access  Private
const createPayment = asyncHandler(async (req, res, next) => {
  try {
    const {
      booking,
      paymentType,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    // Validate required fields
    if (!booking || !paymentType || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Create payment
    const payment = await Payment.create({
      booking,
      user: req.user.id,
      paymentType,
      amount: parseFloat(amount),
      paymentMethod,
      transactionId,
      notes,
      status: 'paid',
      paymentDate: new Date(),
      receiptNumber: `RCP${Date.now()}`
    });

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get all invoices for a user
// @route   GET /api/v1/payments/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting invoices for user:', req.user.id);

    // For now, return empty array as we don't have invoice model yet
    const invoices = [];

    console.log('Found invoices:', invoices.length);

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Create final invoice
// @route   POST /api/v1/payments/invoice
// @access  Private
const createInvoice = asyncHandler(async (req, res, next) => {
  // For now, just return success as we don't have invoice model yet
  res.status(201).json({
    success: true,
    message: 'Invoice creation not implemented yet',
    data: {}
  });
});

// @desc    Get payment summary for a booking
// @route   GET /api/v1/payments/booking/:bookingId/summary
// @access  Private
const getPaymentSummary = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  // Get all payments for this booking
  const payments = await Payment.find({ booking: bookingId, status: 'paid' });

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalAmount = 20000; // Mock total amount
  const balanceAmount = totalAmount - totalPaid;

  res.status(200).json({
    success: true,
    data: {
      booking: {
        id: bookingId,
        eventType: 'Wedding',
        service: 'Photography Package',
        totalAmount
      },
      payments: {
        totalPaid,
        balanceAmount,
        paymentStatus: balanceAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending'
      },
      paymentsList: payments,
      invoices: []
    }
  });
});

// @desc    Generate quotation for a booking
// @route   POST /api/v1/payments/quotation
// @access  Private
const generateQuotation = asyncHandler(async (req, res, next) => {
  // For now, just return success
  res.status(201).json({
    success: true,
    message: 'Quotation generation not implemented yet',
    data: {}
  });
});

// @desc    Update payment status
// @route   PUT /api/v1/payments/:id/status
// @access  Private
const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['pending', 'partial', 'paid', 'failed', 'refunded'].includes(status)) {
    return next(new ErrorResponse('Valid status is required', 400));
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  // Check authorization
  if (payment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this payment', 403));
  }

  payment.status = status;
  await payment.save();

  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: payment
  });
});

module.exports = {
  getPayments,
  createPayment,
  generateQuotation,
  getInvoices,
  createInvoice,
  updatePaymentStatus,
  getPaymentSummary
};
