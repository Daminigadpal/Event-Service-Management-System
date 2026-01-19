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
    console.log('User role:', req.user.role);

    let payments;
    
    // If admin, get all payments, otherwise get user's payments only
    if (req.user.role === 'admin') {
      payments = await Payment.find({}).populate('user', 'name email').sort({ paymentDate: -1 });
      console.log('Admin user - getting all payments');
    } else {
      payments = await Payment.find({ user: req.user.id }).sort({ paymentDate: -1 });
      console.log('Regular user - getting own payments');
    }

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
    console.log('DEBUG: createPayment called');
    console.log('DEBUG: req.user:', req.user);
    console.log('DEBUG: req.body:', JSON.stringify(req.body, null, 2));

    const {
      booking,
      paymentType,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    // Validate and normalize data
    console.log('DEBUG: Validating payment data');
    
    // Normalize booking ID - if it's a string, try to convert to ObjectId
    let normalizedBooking = booking;
    if (typeof booking === 'string') {
      if (booking.match(/^[0-9a-fA-F]{24}$/)) {
        normalizedBooking = booking; // It's already a valid ObjectId string
        console.log('DEBUG: Using valid ObjectId string:', normalizedBooking);
      } else {
        // Try to find booking by ID or other identifier
        console.log('DEBUG: Looking for booking with identifier:', booking);
        const Booking = require('../models/Booking.js');
        const bookingDoc = await Booking.findOne({ 
          $or: [
            { _id: booking },
            { receiptNumber: booking },
            { 'eventDetails.customId': booking }
          ]
        });
        if (bookingDoc) {
          normalizedBooking = bookingDoc._id;
          console.log('DEBUG: Found booking, using ObjectId:', normalizedBooking);
        } else {
          // Only try to convert if it looks like it could be a number or different format
          if (booking.length === 12 && /^\d+$/.test(booking)) {
            // It's a 12-digit number, might be a different format
            const { ObjectId } = require('mongoose');
            try {
              normalizedBooking = new ObjectId(booking);
              console.log('DEBUG: Converted 12-digit number to ObjectId:', normalizedBooking);
            } catch (error) {
              console.log('DEBUG: Could not convert booking ID to ObjectId:', error.message);
            }
          } else {
            console.log('DEBUG: Invalid booking ID format, cannot resolve');
            return res.status(400).json({
              success: false,
              error: `Invalid booking ID: ${booking}. Please provide a valid 24-character booking ID or find your booking in the booking list.`
            });
          }
        }
      }
    }

    // Normalize payment method
    let normalizedPaymentMethod = paymentMethod;
    if (paymentMethod === 'card') {
      normalizedPaymentMethod = 'credit_card'; // Default to credit card
    } else if (!['credit_card', 'debit_card', 'bank_transfer', 'cash', 'upi', 'cheque', 'other'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: `Invalid payment method: ${paymentMethod}. Must be: credit_card, debit_card, bank_transfer, cash, upi, cheque, or other`
      });
    }

    console.log('DEBUG: normalizedBooking:', normalizedBooking);
    console.log('DEBUG: normalizedPaymentMethod:', normalizedPaymentMethod);

    if (!normalizedBooking || !paymentType || !amount || !normalizedPaymentMethod) {
      console.log('DEBUG: Missing required fields after normalization');
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Create payment
    const payment = await Payment.create({
      booking: normalizedBooking,
      user: req.user.id,
      paymentType,
      amount: parseFloat(amount),
      paymentMethod: normalizedPaymentMethod,
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

    const Invoice = require('../models/Invoice.js');

    // Get all invoices for the user, sorted by issue date (newest first)
    const invoices = await Invoice.find({ customer: req.user.id })
      .populate('booking', 'eventType eventDate eventLocation')
      .sort({ issueDate: -1 });

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
  try {
    console.log('Creating comprehensive invoice for user:', req.user.id);

    const Invoice = require('../models/Invoice.js');
    const Booking = require('../models/Booking.js');
    const Payment = require('../models/Payment.js');
    const EventPreference = require('../models/EventPreference.js');
    const User = require('../models/User.js');

    const {
      bookingId,
      taxRate = 18,
      notes,
      terms
    } = req.body;

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's bookings
    const bookings = await Booking.find({ customer: req.user.id }).sort({ createdAt: -1 });

    // Get user's payments
    const payments = await Payment.find({ user: req.user.id }).sort({ paymentDate: -1 });

    // Get user's event preferences
    const eventPreferences = await EventPreference.findOne({ user: req.user.id });

    // Calculate totals from all bookings
    const totalBookingsAmount = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const totalPaymentsAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Create comprehensive invoice items
    const items = [];

    // Add booking summary
    if (bookings.length > 0) {
      bookings.forEach((booking, index) => {
        items.push({
          description: `Event Service: ${booking.service || 'Event Package'} (${booking.eventType})`,
          quantity: 1,
          unitPrice: booking.totalAmount || 0,
          total: booking.totalAmount || 0
        });
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Create comprehensive notes with all user data
    const comprehensiveNotes = `
USER PROFILE:
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}
Address: ${user.address || 'Not provided'}

EVENT PREFERENCES:
${eventPreferences ? `
Event Type: ${eventPreferences.eventType}
Preferred Venue: ${eventPreferences.preferredVenue}
Budget Range: ₹${eventPreferences.budgetRange.min} - ₹${eventPreferences.budgetRange.max}
Guest Count: ${eventPreferences.guestCount}
Notes: ${eventPreferences.notes || 'None'}
` : 'No preferences set'}

BOOKINGS SUMMARY:
Total Bookings: ${bookings.length}
Total Amount: ₹${totalBookingsAmount.toLocaleString()}

PAYMENTS SUMMARY:
Total Payments: ${payments.length}
Total Paid: ₹${totalPaymentsAmount.toLocaleString()}
Balance: ₹${(totalBookingsAmount - totalPaymentsAmount).toLocaleString()}

${notes || 'Comprehensive invoice including all user data'}
    `.trim();

    // Create invoice
    const invoice = await Invoice.create({
      booking: bookingId || bookings[0]?._id, // Use first booking if no specific booking
      customer: req.user.id,
      invoiceType: 'final',
      items,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: 'sent',
      notes: comprehensiveNotes,
      terms: terms || 'Payment due within 30 days',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      // Store comprehensive data for download
      advancePaid: payments.filter(p => p.paymentType === 'advance').reduce((sum, p) => sum + p.amount, 0),
      balancePaid: payments.filter(p => p.paymentType === 'balance').reduce((sum, p) => sum + p.amount, 0)
    });

    console.log('Comprehensive invoice created successfully:', invoice._id);

    res.status(201).json({
      success: true,
      message: 'Comprehensive invoice created successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error creating comprehensive invoice:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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
  try {
    console.log('Generating quotation for user:', req.user.id);
    console.log('Quotation data:', JSON.stringify(req.body, null, 2));

    const Invoice = require('../models/Invoice.js');
    const Booking = require('../models/Booking.js');

    const {
      bookingId,
      taxRate = 18,
      notes
    } = req.body;

    // Validate booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found or does not belong to user'
      });
    }

    // Calculate estimated totals
    const subtotal = booking.totalAmount || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Create quotation (quotation is a type of invoice)
    const quotation = await Invoice.create({
      booking: bookingId,
      customer: req.user.id,
      invoiceType: 'quotation',
      items: [{
        description: booking.service || 'Event Service Package',
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal
      }],
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: 'sent',
      notes: notes || 'Quotation for event services',
      terms: 'This is a quotation. Final pricing may vary based on specific requirements.',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
    });

    console.log('Quotation created successfully:', quotation._id);

    res.status(201).json({
      success: true,
      message: 'Quotation generated successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error generating quotation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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
