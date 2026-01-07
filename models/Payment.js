const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be a positive number']
  },
  method: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: [true, 'Please add a transaction ID']
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate payments for the same booking
PaymentSchema.index({ booking: 1, transactionId: 1 }, { unique: true });

module.exports = mongoose.model('Payment', PaymentSchema);
