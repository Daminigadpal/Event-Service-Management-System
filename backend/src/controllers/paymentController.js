// backend/src/controllers/paymentController.js
import ErrorResponse from '../utils/errorResponse.js';

// Mock data for testing without MongoDB
let mockPayments = [
  {
    _id: 'payment_1',
    booking: 'booking_1',
    user: '69607e6cc3465f9a8169107d',
    paymentType: 'advance',
    amount: 5000,
    paymentMethod: 'credit_card',
    transactionId: 'txn_123456789',
    notes: 'Advance payment for wedding package',
    status: 'paid',
    paymentDate: new Date('2024-01-15'),
    receiptNumber: 'RCP1705123456',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'payment_2',
    booking: 'booking_2',
    user: '69607e6cc3465f9a8169107d',
    paymentType: 'full',
    amount: 15000,
    paymentMethod: 'bank_transfer',
    transactionId: 'txn_987654321',
    notes: 'Full payment for birthday party',
    status: 'paid',
    paymentDate: new Date('2024-01-20'),
    receiptNumber: 'RCP1705987654',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];
let mockInvoices = [
  {
    _id: 'invoice_1',
    booking: 'booking_1',
    customer: '69607e6cc3465f9a8169107d',
    invoiceType: 'final',
    items: [
      {
        description: 'Wedding Package - Photography',
        quantity: 1,
        unitPrice: 20000,
        total: 20000
      }
    ],
    subtotal: 20000,
    taxRate: 18,
    taxAmount: 3600,
    totalAmount: 23600,
    status: 'paid',
    notes: 'Final invoice for wedding event',
    terms: 'Payment due within 30 days',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];
let paymentIdCounter = 3; // Start from 3 since we have 2 mock payments
let invoiceIdCounter = 1;

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @route   GET /api/v1/payments
// @access  Private
export const getPayments = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting payments for user:', req.user.id);
    
    // Filter payments by user
    const userPayments = mockPayments.filter(payment => 
      payment.user === req.user.id
    );
    
    console.log('Found payments:', userPayments.length);
    
    res.status(200).json({
      success: true,
      data: userPayments,
      count: userPayments.length
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
      user: req.user.id,
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

// @desc    Get all invoices for a user
// @route   GET /api/v1/payments/invoices
// @access  Private
export const getInvoices = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting invoices for user:', req.user.id);
    
    // Filter invoices by customer (user)
    const userInvoices = mockInvoices.filter(invoice => 
      invoice.customer === req.user.id
    );
    
    console.log('Found invoices:', userInvoices.length);
    
    res.status(200).json({
      success: true,
      count: userInvoices.length,
      data: userInvoices
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
export const createInvoice = asyncHandler(async (req, res, next) => {
  const { bookingId, items, taxRate = 0, notes, terms, dueDate } = req.body;
  
  if (!bookingId || !items || !Array.isArray(items)) {
    return next(new ErrorResponse('Booking ID and items are required', 400));
  }
  
  // Create mock invoice
  const invoice = {
    _id: `invoice_${invoiceIdCounter++}`,
    booking: bookingId,
    customer: req.user.id,
    invoiceType: 'final',
    items,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
    taxRate,
    taxAmount: items.reduce((sum, item) => sum + item.total, 0) * (taxRate / 100),
    totalAmount: items.reduce((sum, item) => sum + item.total, 0) + (items.reduce((sum, item) => sum + item.total, 0) * (taxRate / 100)),
    notes,
    terms,
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockInvoices.push(invoice);
  
  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: invoice
  });
});

// @desc    Get payment summary for a booking
// @route   GET /api/v1/payments/booking/:bookingId/summary
// @access  Private
export const getPaymentSummary = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  
  // Get all payments for this booking
  const payments = mockPayments.filter(payment => payment.booking === bookingId);
  const invoices = mockInvoices.filter(invoice => invoice.booking === bookingId);
  
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
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
      invoices: invoices
    }
  });
});

// @desc    Generate quotation for a booking
// @route   POST /api/v1/payments/quotation
// @access  Private
export const generateQuotation = asyncHandler(async (req, res, next) => {
  const { bookingId, taxRate = 0, notes, terms } = req.body;
  
  if (!bookingId) {
    return next(new ErrorResponse('Booking ID is required', 400));
  }
  
  // Create quotation items
  const items = [
    {
      description: 'Event Service Package',
      quantity: 1,
      unitPrice: 20000,
      total: 20000
    }
  ];
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;
  
  // Create quotation
  const quotation = {
    _id: `quotation_${Date.now()}`,
    booking: bookingId,
    customer: req.user.id,
    invoiceType: 'quotation',
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    status: 'sent',
    notes,
    terms,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    message: 'Quotation generated successfully',
    data: quotation
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
  
  const paymentId = req.params.id;
  const paymentIndex = mockPayments.findIndex(payment => payment._id === paymentId);
  
  if (paymentIndex === -1) {
    return next(new ErrorResponse('Payment not found', 404));
  }
  
  // Check authorization
  if (mockPayments[paymentIndex].user !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this payment', 403));
  }
  
  mockPayments[paymentIndex].status = status;
  
  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: mockPayments[paymentIndex]
  });
});

// Legacy exports for backward compatibility
export const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const paymentIndex = mockPayments.findIndex(payment => payment._id === paymentId);
    
    if (paymentIndex === -1) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    mockPayments.splice(paymentIndex, 1);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
