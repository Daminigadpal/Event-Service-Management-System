// backend/src/controllers/staffAvailabilityController.js
import StaffAvailability from '../models/StaffAvailability.js';
import Booking from '../models/Booking.js';
import ErrorResponse from '../utils/errorResponse.js';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get staff availability for a specific date range
// @route   GET /api/v1/staff-availability
// @access  Private
export const getStaffAvailability = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, staffId } = req.query;
  
  let query = {};
  
  if (staffId) {
    query.staff = staffId;
  }
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  } else if (startDate) {
    query.date = {
      $gte: new Date(startDate)
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
export const setStaffAvailability = asyncHandler(async (req, res, next) => {
  const { staff, date, timeSlots, status, notes } = req.body;
  
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
  
  // Check if availability already exists for this staff and date
  const existingAvailability = await StaffAvailability.findOne({ staff, date });
  
  let availability;
  
  if (existingAvailability) {
    // Update existing availability
    availability = await StaffAvailability.findByIdAndUpdate(
      existingAvailability._id,
      { timeSlots, status, notes },
      { new: true, runValidators: true }
    ).populate('staff', 'name email');
  } else {
    // Create new availability
    availability = await StaffAvailability.create({
      staff,
      date,
      timeSlots: timeSlots || [],
      status: status || 'available',
      notes
    });
    
    await availability.populate('staff', 'name email');
  }
  
  res.status(201).json({
    success: true,
    message: 'Staff availability set successfully',
    data: availability
  });
});

// @desc    Check for booking conflicts
// @route   POST /api/v1/staff-availability/check-conflicts
// @access  Private
export const checkBookingConflicts = asyncHandler(async (req, res, next) => {
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
export const getDailySchedule = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const { staffId } = req.query;
  
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
  
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
export const deleteStaffAvailability = asyncHandler(async (req, res, next) => {
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
