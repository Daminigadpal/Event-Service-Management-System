// backend/src/controllers/eventPreferenceController.js
const EventPreference = require('../models/EventPreference.js');
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all event preferences for a user
// @route   GET /api/event-preferences
// @access  Private
const getEventPreferences = asyncHandler(async (req, res, next) => {
  const preferences = await EventPreference.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: preferences.length,
    data: preferences
  });
});

// @desc    Create event preferences
// @route   POST /api/event-preferences
// @access  Private
const createEventPreference = asyncHandler(async (req, res, next) => {
  const { eventType, preferredVenue, budgetRange, guestCount, notes } = req.body;

  // Check if user already has preferences
  const existingPreference = await EventPreference.findOne({ user: req.user.id });

  if (existingPreference) {
    return next(new ErrorResponse('User already has event preferences. Use PUT to update instead.', 400));
  }

  // Create new preference
  const preference = await EventPreference.create({
    user: req.user.id,
    eventType,
    preferredVenue,
    budgetRange,
    guestCount,
    notes
  });

  res.status(201).json({
    success: true,
    message: 'Event preference created successfully',
    data: preference
  });
});

// @desc    Update event preferences
// @route   PUT /api/event-preferences
// @access  Private
const updateEventPreferences = asyncHandler(async (req, res, next) => {
  const { eventType, preferredVenue, budgetRange, guestCount, notes } = req.body;

  // Find existing preference
  let preference = await EventPreference.findOne({ user: req.user.id });

  if (!preference) {
    return next(new ErrorResponse('Event preferences not found', 404));
  }

  // Update preference
  preference = await EventPreference.findOneAndUpdate(
    { user: req.user.id },
    {
      eventType,
      preferredVenue,
      budgetRange,
      guestCount,
      notes,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Event preferences updated successfully',
    data: preference
  });
});

module.exports = {
  getEventPreferences,
  createEventPreference,
  updateEventPreferences
};