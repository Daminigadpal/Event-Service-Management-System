// backend/src/controllers/eventPreferenceController.js
import EventPreference from '../models/EventPreference.js';
import ErrorResponse from '../utils/errorResponse.js';

// Mock data for testing without MongoDB
let mockEventPreferences = [];

// Debug log to track mock data
console.log('Event Preference Controller - Mock data initialized:', mockEventPreferences.length);

// Define asyncHandler directly in the file
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all event preferences for a user
// @route   GET /api/event-preferences
// @access  Private
export const getEventPreferences = asyncHandler(async (req, res, next) => {
  // Return mock preferences for the user
  const userPreferences = mockEventPreferences.filter(pref => pref.user === req.user.id);
  res.status(200).json({
    success: true,
    count: userPreferences.length,
    data: userPreferences
  });
});

// @desc    Create event preferences
// @route   POST /api/event-preferences
// @access  Private
export const createEventPreference = asyncHandler(async (req, res, next) => {
  const { eventType, preferredVenue, budgetRange, guestCount, notes } = req.body;

  // Check if user already has preferences
  const existingPreference = mockEventPreferences.find(pref => pref.user === req.user.id);
  
  if (existingPreference) {
    return next(new ErrorResponse('User already has event preferences. Use PUT to update instead.', 400));
  }

  // Create new preference
  const newPreference = {
    _id: `pref_${Date.now()}`,
    user: req.user.id,
    eventType,
    preferredVenue,
    budgetRange,
    guestCount,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add to mock data
  mockEventPreferences.push(newPreference);

  res.status(201).json({
    success: true,
    message: 'Event preference created successfully',
    data: newPreference
  });
});

// @desc    Update event preferences
// @route   PUT /api/event-preferences
// @access  Private
export const updateEventPreferences = asyncHandler(async (req, res, next) => {
  const { eventType, preferredVenue, budgetRange, guestCount } = req.body;

  console.log('Update request data:', { eventType, preferredVenue, budgetRange, guestCount });

  // Find existing preference in mock data
  let preferenceIndex = mockEventPreferences.findIndex(pref => pref.user === req.user.id);
  
  if (preferenceIndex === -1) {
    return next(new ErrorResponse('Event preferences not found', 404));
  }

  // Update existing preference
  const updatedPreference = {
    ...mockEventPreferences[preferenceIndex],
    eventType,
    preferredVenue,
    budgetRange,
    guestCount,
    updatedAt: new Date()
  };

  mockEventPreferences[preferenceIndex] = updatedPreference;

  res.status(200).json({
    success: true,
    message: 'Event preferences updated successfully',
    data: updatedPreference
  });
});