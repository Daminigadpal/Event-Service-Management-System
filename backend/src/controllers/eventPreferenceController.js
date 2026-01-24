// backend/src/controllers/eventPreferenceController.js
const EventPreference = require('../models/EventPreference.js');
const User = require('../models/User.js');
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all event preferences for a user
// @route   GET /api/event-preferences
// @access  Private
const getEventPreferences = asyncHandler(async (req, res, next) => {
  // Get user-specific preferences for regular users, all preferences for admin
  let preferences;
  if (req.user.role === 'admin') {
    preferences = await EventPreference.find({}).populate('user', 'name email');
  } else {
    preferences = await EventPreference.find({ user: req.user.id }).populate('user', 'name email');
  }

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
  console.log('DEBUG: createEventPreference called');
  console.log('DEBUG: req.user:', req.user);
  console.log('DEBUG: req.body:', JSON.stringify(req.body, null, 2));

  const { eventType, preferredVenue, budgetRange, guestCount, notes } = req.body;

  // Check if user already has preferences
  const existingPreference = await EventPreference.findOne({ user: req.user.id });
  console.log('DEBUG: existingPreference:', existingPreference);

  if (existingPreference) {
    console.log('DEBUG: User already has preferences, returning 400');
    return next(new ErrorResponse('User already has event preferences. Use PUT to update instead.', 400));
  }

  // Validate and normalize data
  let normalizedEventType = eventType?.toLowerCase();
  if (!['wedding', 'corporate', 'birthday', 'conference', 'other'].includes(normalizedEventType)) {
    return next(new ErrorResponse('Invalid event type. Must be: wedding, corporate, birthday, conference, or other', 400));
  }

  // Handle guestCount - if it's a string range, take the higher number
  let normalizedGuestCount = guestCount;
  if (typeof guestCount === 'string' && guestCount.includes('-')) {
    normalizedGuestCount = parseInt(guestCount.split('-')[1]) || parseInt(guestCount.split('-')[0]);
  } else if (typeof guestCount === 'string') {
    normalizedGuestCount = parseInt(guestCount);
  }

  // Validate and normalize budgetRange
  let normalizedBudgetRange = budgetRange;
  if (typeof budgetRange === 'string' && budgetRange.includes('-')) {
    const [min, max] = budgetRange.split('-').map(v => parseInt(v.trim()));
    normalizedBudgetRange = { min, max };
  } else if (typeof budgetRange === 'object' && budgetRange.min && budgetRange.max) {
    normalizedBudgetRange = budgetRange;
  } else {
    return next(new ErrorResponse('Budget range must be in format "min-max" (e.g., "1000-3000")', 400));
  }

  if (!normalizedBudgetRange || typeof normalizedBudgetRange.min !== 'number' || typeof normalizedBudgetRange.max !== 'number') {
    return next(new ErrorResponse('Budget range must include valid min and max values', 400));
  }

  // Create new preference
  const preference = await EventPreference.create({
    user: req.user.id,
    eventType: normalizedEventType,
    preferredVenue,
    budgetRange: normalizedBudgetRange,
    guestCount: normalizedGuestCount,
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
  console.log('DEBUG: updateEventPreferences called');
  console.log('DEBUG: req.user:', req.user);
  console.log('DEBUG: req.body:', JSON.stringify(req.body, null, 2));

  const { eventType, preferredVenue, budgetRange, guestCount, notes } = req.body;

  // Find existing preference
  let preference = await EventPreference.findOne({ user: req.user.id });
  console.log('DEBUG: existing preference:', preference);

  if (!preference) {
    console.log('DEBUG: No existing preference found');
    return next(new ErrorResponse('Event preferences not found', 404));
  }

  // Validate and normalize data like in create
  console.log('DEBUG: Normalizing update data');
  let normalizedEventType = eventType?.toLowerCase();
  console.log('DEBUG: normalizedEventType:', normalizedEventType);
  if (!['wedding', 'corporate', 'birthday', 'conference', 'other'].includes(normalizedEventType)) {
    console.log('DEBUG: Invalid event type in update');
    return next(new ErrorResponse('Invalid event type. Must be: wedding, corporate, birthday, conference, or other', 400));
  }

  let normalizedGuestCount = guestCount;
  console.log('DEBUG: original guestCount in update:', guestCount, 'type:', typeof guestCount);
  if (typeof guestCount === 'string' && guestCount.includes('-')) {
    normalizedGuestCount = parseInt(guestCount.split('-')[1]) || parseInt(guestCount.split('-')[0]);
  } else if (typeof guestCount === 'string') {
    normalizedGuestCount = parseInt(guestCount);
  } else if (typeof guestCount === 'number') {
    normalizedGuestCount = guestCount;
  } else {
    normalizedGuestCount = 50;
  }
  console.log('DEBUG: normalizedGuestCount in update:', normalizedGuestCount);

  // Validate and normalize budgetRange
  let normalizedBudgetRange = budgetRange;
  if (typeof budgetRange === 'string' && budgetRange.includes('-')) {
    const [min, max] = budgetRange.split('-').map(v => parseInt(v.trim()));
    normalizedBudgetRange = { min, max };
  } else if (typeof budgetRange === 'object' && budgetRange.min && budgetRange.max) {
    normalizedBudgetRange = budgetRange;
  } else {
    return next(new ErrorResponse('Budget range must be in format "min-max" (e.g., "1000-3000")', 400));
  }

  console.log('DEBUG: budgetRange in update:', budgetRange, 'type:', typeof budgetRange);
  if (!normalizedBudgetRange || typeof normalizedBudgetRange.min !== 'number' || typeof normalizedBudgetRange.max !== 'number') {
    console.log('DEBUG: Invalid budgetRange format in update');
    return next(new ErrorResponse('Budget range must include valid min and max values', 400));
  }

  // Update preference
  console.log('DEBUG: Updating with normalized data:', {
    eventType: normalizedEventType,
    preferredVenue,
    budgetRange: normalizedBudgetRange,
    guestCount: normalizedGuestCount,
    notes
  });
  preference = await EventPreference.findOneAndUpdate(
    { user: req.user.id },
    {
      eventType: normalizedEventType,
      preferredVenue,
      budgetRange: normalizedBudgetRange,
      guestCount: normalizedGuestCount,
      notes,
      updatedAt: new Date()
    },
    { new: true, runValidators: false }
  );
  console.log('DEBUG: Update result:', preference);

  res.status(200).json({
    success: true,
    message: 'Event preferences updated successfully',
    data: preference
  });
});

// @desc    Get all event preferences (Admin only)
// @route   GET /api/event-preferences/all
// @access  Private/Admin
const getAllEventPreferences = asyncHandler(async (req, res, next) => {
  const preferences = await EventPreference.find({}).populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: preferences.length,
    data: preferences
  });
});

module.exports = {
  getEventPreferences,
  getAllEventPreferences,
  createEventPreference,
  updateEventPreferences
};