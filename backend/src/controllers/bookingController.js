// backend/src/controllers/bookingController.js
const Booking = require('../models/Booking.js');
const Service = require('../models/Service.js');
const User = require('../models/User.js');
const ErrorResponse = require('../utils/errorResponse.js');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all bookings (Admin) or user's bookings (Customer/Staff)
// @route   GET /api/v1/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res, next) => {
  let bookings;
  
  if (req.user.role === 'staff') {
    // Staff can see bookings assigned to them
    bookings = await Booking.find({ staffAssigned: req.user.id })
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration')
      .sort({ eventDate: 1 });
  } else {
    // Customers see their own bookings
    bookings = await Booking.find({ customer: req.user.id })
      .populate('service', 'name description price duration')
      .populate('staffAssigned', 'name email phone')
      .sort({ eventDate: 1 });
  }

  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length
  });
});

// @desc    Get ALL bookings from database (Admin only)
// @route   GET /api/v1/bookings/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res, next) => {
  console.log('🔍 Getting ALL bookings from database...');
  
  try {
    // Get all bookings from database with full population
    const bookings = await Booking.find({})
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration')
      .populate('staffAssigned', 'name email phone')
      .sort({ eventDate: 1 });

    console.log('📊 Found bookings:', bookings.length);
    
    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
      message: 'All bookings retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting all bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings',
      message: error.message
    });
  }
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service')
    .populate('customer', 'name email phone')
    .populate('staffAssigned', 'name email phone');

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (booking.customer._id.toString() !== req.user.id &&
      booking.staffAssigned?._id.toString() !== req.user.id &&
      req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this booking', 401));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking (Inquiry)
// @route   POST /api/v1/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res, next) => {
  const { service, eventType, eventDate, eventLocation, guestCount, specialRequests, specialRequirements } = req.body;

  // Validate required fields
  if (!service || !eventType || !eventDate || !eventLocation || !guestCount) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Create booking
  const booking = await Booking.create({
    customer: req.user.id,
    service,
    eventType,
    eventDate: new Date(eventDate),
    eventLocation,
    guestCount: parseInt(guestCount),
    specialRequests: specialRequests || specialRequirements, // Handle both field names
    status: 'inquiry'
  });

  res.status(201).json({
    success: true,
    message: 'Booking inquiry created successfully',
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this booking', 401));
  }

  // Don't allow updating certain fields directly
  const { status, paymentStatus, staffAssigned, ...updateData } = req.body;

  booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('service').populate('customer').populate('staffAssigned');

  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: booking
  });
});

// @desc    Send quote to customer
// @route   PUT /api/v1/bookings/:id/quote
// @access  Private/Admin
const sendQuote = asyncHandler(async (req, res, next) => {
  const { quotedPrice } = req.body;

  if (!quotedPrice) {
    return next(new ErrorResponse('Quoted price is required', 400));
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      quotedPrice,
      quotedAt: new Date(),
      status: 'quoted'
    },
    { new: true, runValidators: true }
  ).populate('service').populate('customer');

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Quote sent to customer',
    data: booking
  });
});

// @desc    Confirm booking
// @route   PUT /api/v1/bookings/:id/confirm
// @access  Private
const confirmBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Check authorization
  if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to confirm this booking', 401));
  }

  if (booking.status !== 'quoted') {
    return next(new ErrorResponse('Only quoted bookings can be confirmed', 400));
  }

  booking.status = 'confirmed';
  booking.confirmationDate = new Date();
  await booking.save();

  await booking.populate('service').populate('customer').populate('staffAssigned');

  res.status(200).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: booking
  });
});

// @desc    Assign staff to booking
// @route   PUT /api/v1/bookings/:id/assign-staff
// @access  Private/Admin
const assignStaffToBooking = asyncHandler(async (req, res, next) => {
  const { staffId } = req.body;

  if (!staffId) {
    return next(new ErrorResponse('Staff ID is required', 400));
  }

  // Verify staff exists and is actually staff
  const staff = await User.findById(staffId);
  if (!staff || staff.role !== 'staff') {
    return next(new ErrorResponse('Invalid staff member', 404));
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      staffAssigned: staffId,
      staffAssignedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate('service').populate('customer').populate('staffAssigned');

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Staff assigned to booking',
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Status is required', 400));
  }

  const validStatuses = ['inquiry', 'quoted', 'confirmed', 'inprogress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  booking.status = status;
  if (status === 'completed') {
    booking.completionDate = new Date();
  }

  await booking.save();
  await booking.populate('service').populate('customer').populate('staffAssigned');

  res.status(200).json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Check authorization
  if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this booking', 401));
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    return next(new ErrorResponse(`Cannot cancel a ${booking.status} booking`, 400));
  }

  booking.status = 'cancelled';
  await booking.save();

  await booking.populate('service').populate('customer').populate('staffAssigned');

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private/Admin/User (own bookings only)
const deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Allow admins to delete any booking, or users to delete their own bookings
  if (req.user.role !== 'admin' && booking.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this booking', 403));
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully',
    data: {}
  });
});

module.exports = {
  getBookings,
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  sendQuote,
  confirmBooking,
  assignStaffToBooking,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
};