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
    status: { 
      type: String, 
      enum: {
        values: ["inquiry", "quoted", "confirmed", "inprogress", "completed", "cancelled"],
        message: '{VALUE} is not a valid status'
      }, 
      default: "inquiry" 
    },
    staffAssigned: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      index: true
    },
    paymentStatus: { 
      type: String, 
      enum: {
        values: ["pending", "partial", "paid"],
        message: '{VALUE} is not a valid payment status'
      }, 
      default: "pending" 
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot be more than 1000 characters']
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

// Virtual for getting the total price
bookingSchema.virtual('totalPrice').get(function() {
  // Example: return this.service.price * this.guestCount;
  return 0; // Update this based on your pricing logic
});

// Add a pre-save hook to validate the staff assignment
bookingSchema.pre('save', async function(next) {
  if (this.isModified('staffAssigned') && this.staffAssigned) {
    const User = mongoose.model('User');
    const staff = await User.findById(this.staffAssigned);
    if (!staff || staff.role !== 'staff') {
      throw new Error('Assigned user must be a staff member');
    }
  }
  next();
});

// Add a static method to find bookings by customer
bookingSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customer: customerId })
    .populate('service', 'name description')
    .populate('staffAssigned', 'name email')
    .sort({ eventDate: 1 });
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;