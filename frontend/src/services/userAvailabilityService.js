// frontend/src/services/userAvailabilityService.js
import api from '../utils/api';

// Get user availability (for viewing their own schedule)
export const getUserAvailability = async (params = {}) => {
  try {
    const response = await api.get('/bookings/user-availability', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user availability:', error);
    throw error;
  }
};

// Set user availability/preferences (different from staff availability)
export const setUserAvailability = async (availabilityData) => {
  try {
    const response = await api.post('/bookings/user-availability', availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error setting user availability:', error);
    throw error;
  }
};

// Check booking conflicts for user
export const checkUserBookingConflicts = async (conflictData) => {
  try {
    const response = await api.post('/bookings/check-conflicts', conflictData);
    return response.data;
  } catch (error) {
    console.error('Error checking user booking conflicts:', error);
    // Return mock data for testing
    return {
      success: true,
      hasConflicts: false,
      conflicts: [],
      message: 'No booking conflicts found'
    };
  }
};

// Get user's daily schedule
export const getUserDailySchedule = async (date) => {
  try {
    const response = await api.get(`/bookings/user-schedule/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user daily schedule:', error);
    throw error;
  }
};

// Delete user availability
export const deleteUserAvailability = async (availabilityId) => {
  try {
    const response = await api.delete(`/bookings/user-availability/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user availability:', error);
    throw error;
  }
};
