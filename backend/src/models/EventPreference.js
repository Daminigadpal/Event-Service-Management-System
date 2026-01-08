// backend/src/models/EventPreference.js
import mongoose from 'mongoose';

const eventPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['wedding', 'corporate', 'birthday', 'conference', 'other']
  },
  preferredVenue: {
    type: String,
    required: [true, 'Preferred venue is required']
  },
  budgetRange: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: 0
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      validate: {
        validator: function(value) {
          return value > this.budgetRange.min;
        },
        message: 'Maximum budget must be greater than minimum budget'
      }
    }
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required'],
    min: [1, 'Guest count must be at least 1']
  }
}, { timestamps: true });

// Ensure one preference document per user
eventPreferenceSchema.index({ user: 1 }, { unique: true });

const EventPreference = mongoose.model('EventPreference', eventPreferenceSchema);

export default EventPreference;