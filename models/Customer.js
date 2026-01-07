const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['wedding', 'corporate', 'birthday', 'other'], required: true },
  budgetRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  preferredLocations: [String],
  specialRequirements: String,
  preferredDates: [Date],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const communicationNoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, enum: ['general', 'preference', 'complaint', 'followup'], default: 'general' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isImportant: { type: Boolean, default: false },
  followUpDate: Date,
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' }
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Information
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  
  // Contact Information
  phone: { type: String, trim: true },
  alternatePhone: { type: String, trim: true },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  
  // Preferences
  preferences: [preferenceSchema],
  
  // Communication History
  communicationNotes: [communicationNoteSchema],
  
  // Repeat Customer Data
  isRepeatCustomer: { type: Boolean, default: false },
  firstBookingDate: Date,
  lastBookingDate: Date,
  totalBookings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  
  // Metadata
  referralSource: String,
  tags: [String],
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'blacklisted'], 
    default: 'active' 
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

// Indexes for better query performance
customerSchema.index({ user: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ isRepeatCustomer: 1 });
customerSchema.index({ status: 1 });

// Middleware to update timestamps
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to check if customer is repeat
customerSchema.statics.markAsRepeat = async function(userId) {
  return this.findOneAndUpdate(
    { user: userId },
    { 
      $set: { 
        isRepeatCustomer: true,
        lastBookingDate: new Date() 
      },
      $inc: { totalBookings: 1 },
      $setOnInsert: { firstBookingDate: new Date() }
    },
    { upsert: true, new: true }
  );
};

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
customerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// Method to add communication note
customerSchema.methods.addNote = function(noteData) {
  this.communicationNotes.push(noteData);
  return this.save();
};

// Method to add preference
customerSchema.methods.addPreference = function(preferenceData) {
  this.preferences.push(preferenceData);
  return this.save();
};

// Method to soft delete
customerSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
