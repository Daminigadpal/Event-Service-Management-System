// backend/src/controllers/eventPreferenceController.js
import EventPreference from '../models/EventPreference.js';
import ErrorResponse from '../utils/errorResponse.js';

// Define asyncHandler directly in the file
// In any other controller file
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Then use it with your route handlers
export const someControllerFunction = asyncHandler(async (req, res, next) => {
  // Your async code here
});

// @desc    Get all event preferences for a user
// @route   GET /api/event-preferences
// @access  Private
export const getEventPreferences = asyncHandler(async (req, res, next) => {
  const preferences = await EventPreference.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    count: preferences.length,
    data: preferences
  });
});

// @desc    Create or update event preferences
// @route   PUT /api/event-preferences
// @access  Private
export const updateEventPreferences = asyncHandler(async (req, res, next) => {
  const { eventType, preferredVenue, budgetRange, guestCount } = req.body;

  let preferences = await EventPreference.findOne({ user: req.user.id });

  if (!preferences) {
    // Create new preferences if none exist
    preferences = await EventPreference.create({
      user: req.user.id,
      eventType,
      preferredVenue,
      budgetRange,
      guestCount
    });
  } else {
    // Update existing preferences
    preferences = await EventPreference.findByIdAndUpdate(
      preferences._id,
      { eventType, preferredVenue, budgetRange, guestCount },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    success: true,
    data: preferences
  });
});