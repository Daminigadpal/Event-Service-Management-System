import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import ErrorResponse from '../utils/errorResponse.js';

// Mock data for testing without MongoDB
let mockPayments = [];
let mockInvoices = [];
let paymentIdCounter = 1;
let invoiceIdCounter = 1;

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @route   GET /api/v1/payments
// @access  Private
export const getPayments = asyncHandler(async (req, res, next) => {
  // Return mock payments for testing
  res.status(200).json({
    success: true,
    data: mockPayments,
    count: mockPayments.length
  });
});

// @desc    Create a new payment
// @route   POST /api/v1/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res, next) => {
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

    // Create mock payment
    const payment = {
      _id: `payment_${paymentIdCounter++}`,
      booking: booking || '67890abcd1234ef567890abcd1234ef56789',
      user: req.user._id,
      paymentType,
      amount: parseFloat(amount),
      paymentMethod,
      transactionId,
      notes,
      status: 'paid',
      paymentDate: new Date(),
      receiptNumber: `RCP${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPayments.push(payment);

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

// @desc    Generate quotation for a booking
// @route   POST /api/v1/payments/quotation
// @access  Private
export const generateQuotation = asyncHandler(async (req, res, next) => {
  const { bookingId, taxRate = 0, notes, terms } = req.body;
  
  if (!bookingId) {
    return next(new ErrorResponse('Booking ID is required', 400));
  }
  
  // Verify booking exists
  const booking = await Booking.findById(bookingId).populate('service customer');
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && booking.customer._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to generate quotation for this booking', 404));
  }
  
  // Create quotation items
  const items = [
    {
      description: `${booking.service?.name || 'Event Service'} - ${booking.eventType}`,
      quantity: 1,
      unitPrice: booking.service?.price || 0,
      total: booking.service?.price || 0
    }
  ];
  
  // Add additional charges if any
  if (booking.specialRequests) {
    items.push({
      description: 'Special Requirements',
      quantity: 1,
      unitPrice: 0, // Can be customized later
      total: 0
    });
  }
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;
  
  // Create quotation
  const quotation = await Invoice.create({
    booking: bookingId,
    customer: booking.customer._id,
    invoiceType: 'quotation',
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    status: 'sent',
    notes,
    terms,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due in 7 days
  });
  
  await quotation.populate('booking', 'eventType eventDate eventLocation');
  await quotation.populate('customer', 'name email phone');
  
  res.status(201).json({
    success: true,
    message: 'Quotation generated successfully',
    data: quotation
  });
});

// @desc    Get all invoices for a user
// @route   GET /api/v1/payments/invoices
// @access  Private
export const getInvoices = asyncHandler(async (req, res, next) => {
  // Return mock invoices for testing
  res.status(200).json({
    success: true,
    count: mockInvoices.length,
    data: mockInvoices
  });
});

// @desc    Create final invoice
// @route   POST /api/v1/payments/invoice
// @access  Private
export const createInvoice = asyncHandler(async (req, res, next) => {
  const { bookingId, items, taxRate = 0, notes, terms, dueDate } = req.body;
  
  if (!bookingId || !items || !Array.isArray(items)) {
    return next(new ErrorResponse('Booking ID and items are required', 400));
  }
  
  // Verify booking exists
  const booking = await Booking.findById(bookingId).populate('customer');
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && booking.customer._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to create invoice for this booking', 404));
  }
  
  // Create invoice
  const invoice = await Invoice.create({
    booking: bookingId,
    customer: booking.customer._id,
    invoiceType: 'final',
    items,
    taxRate,
    notes,
    terms,
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Due in 30 days
    status: 'sent'
  });
  
  await invoice.populate('booking', 'eventType eventDate eventLocation');
  await invoice.populate('customer', 'name email phone');
  
  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: invoice
  });
});

// @desc    Update payment status
// @route   PUT /api/v1/payments/:id/status
// @access  Private
export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'partial', 'paid', 'failed', 'refunded'].includes(status)) {
    return next(new ErrorResponse('Valid status is required', 400));
  }
  
  const payment = await Payment.findById(req.params.id);
  
  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && payment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this payment', 403));
  }
  
  payment.status = status;
  await payment.save();
  
  await payment.populate('booking', 'eventType eventDate eventLocation');
  await payment.populate('user', 'name email');
  
  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: payment
  });
});

// @desc    Get payment summary for a booking
// @route   GET /api/v1/payments/booking/:bookingId/summary
// @access  Private
export const getPaymentSummary = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  
  // Verify booking exists
  const booking = await Booking.findById(bookingId).populate('service');
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && booking.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view payment summary for this booking', 403));
  }
  
  // Get all payments for this booking
  const payments = await Payment.find({ booking: bookingId });
  const invoices = await Invoice.find({ booking: bookingId });
  
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalAmount = booking.service?.price || 0;
  const balanceAmount = totalAmount - totalPaid;
  
  res.status(200).json({
    success: true,
    data: {
      booking: {
        id: booking._id,
        eventType: booking.eventType,
        service: booking.service?.name,
        totalAmount
      },
      payments: {
        totalPaid,
        balanceAmount,
        paymentStatus: balanceAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending'
      },
      paymentsList: payments,
      invoices: invoices
    }
  });
});

// Legacy exports for backward compatibility
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};