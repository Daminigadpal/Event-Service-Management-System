// backend/src/controllers/staffAvailabilityController.js
const StaffAvailability = require('../models/StaffAvailability.js');
const Booking = require('../models/Booking.js');
const ErrorResponse = require('../utils/errorResponse.js');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get staff availability for a specific date range
// @route   GET /api/v1/staff-availability
// @access  Private
const getStaffAvailability = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, staffId } = req.query;
  
  let query = {};
  
  if (staffId) {
    query.staff = staffId;
  }
  
  if (startDate && endDate) {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    query.date = {
      $gte: new Date(startYear, startMonth - 1, startDay),
      $lte: new Date(endYear, endMonth - 1, endDay)
    };
  } else if (startDate) {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    query.date = {
      $gte: new Date(startYear, startMonth - 1, startDay)
    };
  }
  
  const availability = await StaffAvailability.find(query)
    .populate('staff', 'name email')
    .sort({ date: 1, 'timeSlots.startTime': 1 });
  
  res.status(200).json({
    success: true,
    count: availability.length,
    data: availability
  });
});

// @desc    Create or update staff availability
// @route   POST /api/v1/staff-availability
// @access  Private/Admin/Staff
const setStaffAvailability = async (req, res, next) => {
  try {
    console.log('🔄 Processing staff availability request');
    const { staff, date, timeSlots, status, notes } = req.body;
    console.log('📋 Request data:', { staff, date, timeSlots, status, notes });
    
    // Use authenticated user's ID if no staff provided (for staff setting their own availability)
    const staffId = staff || req.user.id;
    console.log('👤 Using staff ID:', staffId);
  
  // Validate time slots
  if (timeSlots && timeSlots.length > 0) {
    for (const slot of timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        return next(new ErrorResponse('Each time slot must have start and end time', 400));
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return next(new ErrorResponse('Time must be in HH:MM format', 400));
      }
      
      // Validate that end time is after start time
      if (slot.startTime >= slot.endTime) {
        return next(new ErrorResponse('End time must be after start time', 400));
      }
    }
  }
  
  // Parse date correctly to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day); // month is 0-indexed
  const existingAvailability = await StaffAvailability.findOne({ staff: staffId, date: targetDate });
  
  let availability;
  
  if (existingAvailability) {
    // Update existing availability
    availability = await StaffAvailability.findByIdAndUpdate(
      existingAvailability._id,
      { timeSlots, status, notes },
      { new: true, runValidators: true }
    );
    // Skip populate for now
    // .populate('staff', 'name email');
  } else {
    // Create new availability
    availability = await StaffAvailability.create({
      staff: staffId,
      date: targetDate,
      timeSlots: timeSlots || [],
      status: status || 'available',
      notes
    });

    // Skip populate for now to test
    // await availability.populate('staff', 'name email');
  }
  
    res.status(201).json({
      success: true,
      message: 'Staff availability set successfully',
      data: availability
    });
  } catch (error) {
    console.error('❌ Error in setStaffAvailability:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while setting availability'
    });
  }
};

// @desc    Check for booking conflicts
// @route   POST /api/v1/staff-availability/check-conflicts
// @access  Private
const checkBookingConflicts = asyncHandler(async (req, res, next) => {
  const { date, startTime, endTime, excludeBookingId } = req.body;
  
  if (!date || !startTime || !endTime) {
    return next(new ErrorResponse('Date, start time, and end time are required', 400));
  }
  
  // Parse the booking date and times
  const bookingDate = new Date(date);
  const bookingStart = new Date(`${date}T${startTime}`);
  const bookingEnd = new Date(`${date}T${endTime}`);
  
  // Find all bookings on the same date
  let bookingQuery = {
    eventDate: {
      $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
      $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
    },
    status: { $nin: ['cancelled', 'completed'] }
  };
  
  if (excludeBookingId) {
    bookingQuery._id = { $ne: excludeBookingId };
  }
  
  const existingBookings = await Booking.find(bookingQuery)
    .populate('service', 'name duration')
    .populate('customer', 'name');
  
  const conflicts = [];
  
  for (const booking of existingBookings) {
    const bookingEventStart = new Date(booking.eventDate);
    const serviceDuration = booking.service?.duration || 60; // Default 60 minutes
    const bookingEventEnd = new Date(bookingEventStart.getTime() + serviceDuration * 60000);
    
    // Check for time overlap
    if (
      (bookingStart < bookingEventEnd && bookingEnd > bookingEventStart)
    ) {
      conflicts.push({
        bookingId: booking._id,
        customer: booking.customer?.name,
        service: booking.service?.name,
        startTime: bookingEventStart.toTimeString().slice(0, 5),
        endTime: bookingEventEnd.toTimeString().slice(0, 5),
        status: booking.status
      });
    }
  }
  
  res.status(200).json({
    success: true,
    hasConflicts: conflicts.length > 0,
    conflicts,
    message: conflicts.length > 0 
      ? `Found ${conflicts.length} booking conflict(s)` 
      : 'No booking conflicts found'
  });
});

// @desc    Get daily schedule for a specific date
// @route   GET /api/v1/staff-availability/schedule/:date
// @access  Private
const getDailySchedule = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const { staffId } = req.query;
  
  const [year, month, day] = date.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Get bookings for the day
  let bookingQuery = {
    eventDate: {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: { $nin: ['cancelled'] }
  };
  
  if (staffId) {
    bookingQuery.staffAssigned = staffId;
  }
  
  const bookings = await Booking.find(bookingQuery)
    .populate('service', 'name duration')
    .populate('customer', 'name')
    .populate('staffAssigned', 'name')
    .sort({ eventDate: 1 });
  
  // Get staff availability for the day
  let availabilityQuery = { date: targetDate };
  if (staffId) {
    availabilityQuery.staff = staffId;
  }
  
  const availability = await StaffAvailability.find(availabilityQuery)
    .populate('staff', 'name email')
    .sort({ 'timeSlots.startTime': 1 });
  
  res.status(200).json({
    success: true,
    data: {
      date: targetDate,
      bookings,
      availability,
      summary: {
        totalBookings: bookings.length,
        totalAvailableStaff: availability.filter(a => a.status === 'available').length,
        busySlots: availability.filter(a => a.status === 'busy').length
      }
    }
  });
});

// @desc    Delete staff availability
// @route   DELETE /api/v1/staff-availability/:id
// @access  Private/Admin/Staff (own)
const deleteStaffAvailability = asyncHandler(async (req, res, next) => {
  const availability = await StaffAvailability.findById(req.params.id);
  
  if (!availability) {
    return next(new ErrorResponse('Staff availability not found', 404));
  }
  
  // Check authorization
  if (req.user.role !== 'admin' && availability.staff.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this availability', 403));
  }
  
  await StaffAvailability.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Staff availability deleted successfully',
    data: {}
  });
});

module.exports = {
  getStaffAvailability,
  setStaffAvailability,
  checkBookingConflicts,
  getDailySchedule,
  deleteStaffAvailability
};
