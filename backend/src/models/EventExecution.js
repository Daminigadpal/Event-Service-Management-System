// backend/src/models/EventExecution.js
const mongoose = require('mongoose');

const eventExecutionSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'cancelled'],
    default: 'in_progress'
  },
  completionDate: {
    type: Date
  },
  deliverables: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'verified'],
      default: 'pending'
    },
    uploadDate: Date,
    verificationDate: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  clientFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    feedbackDate: Date,
    wouldRecommend: Boolean,
    suggestions: String
  },
  staffAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: String,
  totalDeliverables: {
    type: Number,
    default: 0
  },
  completedDeliverables: {
    type: Number,
    default: 0
  },
  verifiedDeliverables: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
eventExecutionSchema.index({ booking: 1 });
eventExecutionSchema.index({ user: 1 });
eventExecutionSchema.index({ status: 1 });
eventExecutionSchema.index({ completionDate: -1 });

const EventExecution = mongoose.model('EventExecution', eventExecutionSchema);

module.exports = EventExecution;
