// backend/src/models/EventReminder.js
import mongoose from 'mongoose';

const eventReminderSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  reminderType: {
    type: String,
    enum: ['email', 'sms', 'push'],
    default: 'email'
  },
  reminderTime: {
    type: Date,
    required: [true, 'Reminder time is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
eventReminderSchema.index({ reminderTime: 1, status: 1 });
eventReminderSchema.index({ booking: 1 });
eventReminderSchema.index({ customer: 1 });

const EventReminder = mongoose.model('EventReminder', eventReminderSchema);

export default EventReminder;
