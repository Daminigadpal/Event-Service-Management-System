// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    required: [true, 'Please add an event type']
  },
  eventDate: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  guestCount: {
    type: Number,
    required: [true, 'Please add number of guests']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);