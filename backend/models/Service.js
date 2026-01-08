const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be a positive number']
  },
  duration: {
    // Duration in minutes
    type: Number,
    required: [true, 'Please add a duration']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete bookings when a service is deleted
ServiceSchema.pre('remove', async function(next) {
  console.log(`Bookings being removed from service ${this._id}`);
  await this.model('Booking').deleteMany({ service: this._id });
  next();
});

// Reverse populate with virtuals
ServiceSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'service',
  justOne: false
});

module.exports = mongoose.model('Service', ServiceSchema);
