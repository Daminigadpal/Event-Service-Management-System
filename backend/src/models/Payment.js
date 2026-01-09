// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  paymentType: {
    type: String,
    enum: ['advance', 'balance', 'full'],
    required: [true, 'Payment type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be positive']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'upi', 'cheque', 'other']
  },
  transactionId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  notes: String,
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  quotationId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

// Update booking payment status when payment is completed
paymentSchema.post('save', async function() {
  const Booking = await import('./Booking.js');
  
  if (this.status === 'paid') {
    const booking = await Booking.default.findById(this.booking);
    const payments = await this.constructor.find({ 
      booking: this.booking,
      status: 'paid'
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

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;