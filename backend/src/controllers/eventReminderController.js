// backend/src/controllers/eventReminderController.js
import EventReminder from '../models/EventReminder.js';
import Booking from '../models/Booking.js';
import ErrorResponse from '../utils/errorResponse.js';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get reminders for a user
// @route   GET /api/v1/event-reminders
// @access  Private
export const getReminders = asyncHandler(async (req, res, next) => {
  let query = {};
  
  // Customers can only see their own reminders
  if (req.user.role === 'user') {
    query.customer = req.user.id;
  }
  
  // Add date range filter if provided
  if (req.query.startDate && req.query.endDate) {
    query.reminderTime = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }
  
  // Add status filter if provided
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  const reminders = await EventReminder.find(query)
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('customer', 'name email')
    .sort({ reminderTime: 1 });
  
  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders
  });
});

// @desc    Create event reminder
// @route   POST /api/v1/event-reminders
// @access  Private
export const createReminder = asyncHandler(async (req, res, next) => {
  const { booking, reminderType, reminderTime, message } = req.body;
  
  // Validate required fields
  if (!booking || !reminderTime || !message) {
    return next(new ErrorResponse('Booking, reminder time, and message are required', 400));
  }
  
  // Verify booking exists
  const bookingData = await Booking.findById(booking);
  if (!bookingData) {
    return next(new ErrorResponse('Booking not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && bookingData.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to create reminder for this booking', 403));
  }
  
  // Validate reminder time (should be before event date)
  if (new Date(reminderTime) >= new Date(bookingData.eventDate)) {
    return next(new ErrorResponse('Reminder time must be before event date', 400));
  }
  
  const reminder = await EventReminder.create({
    booking,
    customer: bookingData.customer,
    reminderType: reminderType || 'email',
    reminderTime,
    message,
    status: 'pending'
  });
  
  await reminder.populate('booking', 'eventType eventDate');
  await reminder.populate('customer', 'name email');
  
  res.status(201).json({
    success: true,
    message: 'Event reminder created successfully',
    data: reminder
  });
});

// @desc    Create automatic reminders for a booking
// @route   POST /api/v1/event-reminders/automatic
// @access  Private
export const createAutomaticReminders = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;
  
  if (!bookingId) {
    return next(new ErrorResponse('Booking ID is required', 400));
  }
  
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && booking.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to create reminders for this booking', 403));
  }
  
  const eventDate = new Date(booking.eventDate);
  const reminders = [];
  
  // Create reminder 1 week before
  const oneWeekBefore = new Date(eventDate);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
  
  if (oneWeekBefore > new Date()) {
    const weekReminder = await EventReminder.create({
      booking: bookingId,
      customer: booking.customer,
      reminderType: 'email',
      reminderTime: oneWeekBefore,
      message: `Your ${booking.eventType} event is coming up in 1 week! Event: ${booking.eventLocation} on ${eventDate.toLocaleDateString()}`,
      status: 'pending'
    });
    reminders.push(weekReminder);
  }
  
  // Create reminder 1 day before
  const oneDayBefore = new Date(eventDate);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  
  if (oneDayBefore > new Date()) {
    const dayReminder = await EventReminder.create({
      booking: bookingId,
      customer: booking.customer,
      reminderType: 'email',
      reminderTime: oneDayBefore,
      message: `Reminder: Your ${booking.eventType} event is tomorrow! Event: ${booking.eventLocation} at ${eventDate.toLocaleTimeString()}`,
      status: 'pending'
    });
    reminders.push(dayReminder);
  }
  
  // Create reminder 1 hour before
  const oneHourBefore = new Date(eventDate);
  oneHourBefore.setHours(oneHourBefore.getHours() - 1);
  
  if (oneHourBefore > new Date()) {
    const hourReminder = await EventReminder.create({
      booking: bookingId,
      customer: booking.customer,
      reminderType: 'email',
      reminderTime: oneHourBefore,
      message: `Your ${booking.eventType} event starts in 1 hour! Event: ${booking.eventLocation}`,
      status: 'pending'
    });
    reminders.push(hourReminder);
  }
  
  res.status(201).json({
    success: true,
    message: `Created ${reminders.length} automatic reminders`,
    data: reminders
  });
});

// @desc    Update reminder status (mark as sent)
// @route   PUT /api/v1/event-reminders/:id/status
// @access  Private
export const updateReminderStatus = asyncHandler(async (req, res, next) => {
  const { status, error: errorMessage } = req.body;
  
  if (!status || !['pending', 'sent', 'failed'].includes(status)) {
    return next(new ErrorResponse('Valid status is required', 400));
  }
  
  const reminder = await EventReminder.findById(req.params.id);
  
  if (!reminder) {
    return next(new ErrorResponse('Reminder not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && reminder.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this reminder', 403));
  }
  
  reminder.status = status;
  
  if (status === 'sent') {
    reminder.sentAt = new Date();
  }
  
  if (errorMessage) {
    reminder.error = errorMessage;
  }
  
  await reminder.save();
  
  await reminder.populate('booking', 'eventType eventDate');
  await reminder.populate('customer', 'name email');
  
  res.status(200).json({
    success: true,
    message: 'Reminder status updated successfully',
    data: reminder
  });
});

// @desc    Delete reminder
// @route   DELETE /api/v1/event-reminders/:id
// @access  Private
export const deleteReminder = asyncHandler(async (req, res, next) => {
  const reminder = await EventReminder.findById(req.params.id);
  
  if (!reminder) {
    return next(new ErrorResponse('Reminder not found', 404));
  }
  
  // Check authorization
  if (req.user.role === 'user' && reminder.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this reminder', 403));
  }
  
  await EventReminder.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Reminder deleted successfully',
    data: {}
  });
});

// @desc    Get pending reminders (for cron job)
// @route   GET /api/v1/event-reminders/pending
// @access  Private/Admin
export const getPendingReminders = asyncHandler(async (req, res, next) => {
  const now = new Date();
  
  const pendingReminders = await EventReminder.find({
    reminderTime: { $lte: now },
    status: 'pending'
  })
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('customer', 'name email')
    .sort({ reminderTime: 1 });
  
  res.status(200).json({
    success: true,
    count: pendingReminders.length,
    data: pendingReminders
  });
});
