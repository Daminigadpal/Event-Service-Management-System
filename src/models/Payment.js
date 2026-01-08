// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'other']
  },
  transactionId: {
    type: String,
    required: [true, 'Please add a transaction ID']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

// Update booking payment status when payment is completed
PaymentSchema.post('save', async function() {
  const Booking = require('./Booking');
  
  if (this.status === 'completed') {
    const booking = await Booking.findById(this.booking);
    const payments = await this.constructor.find({ 
      booking: this.booking,
      status: 'completed'
    });
    
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    booking.advancePaid = totalPaid;
    
    if (totalPaid >= booking.totalAmount) {
      booking.paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      booking.paymentStatus = 'partially_paid';
    }
    
    await booking.save();
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);