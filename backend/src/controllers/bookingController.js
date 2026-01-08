// backend/src/controllers/bookingController.js
import Booking from '../models/Booking.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email');
    if (!booking) {
      return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to update this booking`, 401));
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to delete this booking`, 401));
    }

    await booking.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign staff to booking
// @route   PUT /api/v1/bookings/:id/assign-staff
// @access  Private/Admin
export const assignStaffToBooking = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    
    if (!staffId) {
      return next(new ErrorResponse('Please provide a staff ID', 400));
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Check if the staff exists
    const staff = await mongoose.model('User').findById(staffId);
    if (!staff) {
      return next(new ErrorResponse(`Staff not found with id of ${staffId}`, 404));
    }

    // Update the staffAssigned field
    booking.staffAssigned = staffId;
    await booking.save();

    // Populate the staff details in the response
    booking = await Booking.findById(booking._id).populate('staffAssigned', 'name email');

    res.status(200).json({ 
      success: true, 
      data: booking,
      message: `Staff assigned to booking successfully`
    });
  } catch (err) {
    next(err);
  }
};