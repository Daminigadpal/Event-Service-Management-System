// backend/src/models/StaffAvailability.js
import mongoose from 'mongoose';

const staffAvailabilitySchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  timeSlots: [{
    startTime: {
      type: String, // Format: "09:00"
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String, // Format: "17:00"
      required: [true, 'End time is required']
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['available', 'busy', 'off'],
    default: 'available'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate availability entries
staffAvailabilitySchema.index({ staff: 1, date: 1 }, { unique: true });

// Index for efficient querying
staffAvailabilitySchema.index({ staff: 1, date: 1, 'timeSlots.startTime': 1 });

const StaffAvailability = mongoose.model('StaffAvailability', staffAvailabilitySchema);

export default StaffAvailability;
