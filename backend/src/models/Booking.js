// backend/src/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, 'Customer ID is required'],
      index: true
    },
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Service", 
      required: [true, 'Service ID is required'] 
    },
    // Event Details
    eventType: {
      type: String,
      enum: {
        values: ["wedding", "birthday", "corporate", "anniversary", "graduation", "other"],
        message: '{VALUE} is not a valid event type'
      },
      required: [true, 'Event type is required']
    },
    eventDate: { 
      type: Date, 
      required: [true, 'Event date is required'],
      validate: {
        validator: function(value) {
          return value > new Date();
        },
        message: 'Event date must be in the future'
      }
    },
    eventLocation: {
      type: String,
      required: [true, 'Event location is required'],
      maxlength: [500, 'Location cannot be more than 500 characters']
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
      max: [10000, 'Guest count cannot exceed 10000']
    },
    // Booking Status Flow
    status: { 
      type: String, 
      enum: {
        values: ["inquiry", "quoted", "confirmed", "inprogress", "completed", "cancelled"],
        message: '{VALUE} is not a valid status'
      }, 
      default: "inquiry" 
    },
    // Quote and Payment
    quotedPrice: {
      type: Number,
      default: null,
      min: [0, 'Price must be a positive number']
    },
    quotedAt: {
      type: Date,
      default: null
    },
    paymentStatus: { 
      type: String, 
      enum: {
        values: ["pending", "partial", "paid"],
        message: '{VALUE} is not a valid payment status'
      }, 
      default: "pending" 
    },
    // Staff Assignment
    staffAssigned: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      index: true,
      default: null
    },
    staffAssignedAt: {
      type: Date,
      default: null
    },
    // Additional Details
    specialRequests: {
      type: String,
      maxlength: [1000, 'Special requests cannot be more than 1000 characters']
    },
    internalNotes: {
      type: String,
      maxlength: [1000, 'Internal notes cannot be more than 1000 characters']
    },
    confirmationDate: {
      type: Date,
      default: null
    },
    completionDate: {
      type: Date,
      default: null
    }
  }, 
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
bookingSchema.index({ customer: 1, eventDate: 1 });
bookingSchema.index({ status: 1, eventDate: 1 });
bookingSchema.index({ staffAssigned: 1, status: 1 });

// Virtual for calculating days until event
bookingSchema.virtual('daysUntilEvent').get(function() {
  const today = new Date();
  const diffTime = this.eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save hook to validate staff assignment
// Pre-save hook to validate staff assignment
// Pre-save hook to validate staff assignment
// bookingSchema.pre('save', function(next) {
//   // Staff validation is optional - skip if not assigned
//   next();
// });

// Static method to find bookings by customer
bookingSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customer: customerId })
    .populate('service', 'name description price duration')
    .populate('staffAssigned', 'name email phone')
    .sort({ eventDate: 1 });
};

// Static method to find bookings by staff
bookingSchema.statics.findByStaff = function(staffId) {
  return this.find({ staffAssigned: staffId })
    .populate('customer', 'name email phone')
    .populate('service', 'name description')
    .sort({ eventDate: 1 });
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;