// frontend/src/services/staffAvailabilityService.js
import api from '../api';

// Get staff availability
export const getStaffAvailability = async (params = {}) => {
  try {
    const response = await api.get('/staff-availability', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    throw error;
  }
};

// Set staff availability
export const setStaffAvailability = async (availabilityData) => {
  try {
    const response = await api.post('/staff-availability', availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error setting staff availability:', error);
    throw error;
  }
};

// Check booking conflicts
export const checkBookingConflicts = async (conflictData) => {
  try {
    // Mock conflict checking for testing
    const { date, startTime, endTime } = conflictData;
    
    // Simple mock logic - no conflicts for demo
    const mockResponse = {
      success: true,
      hasConflicts: false,
      conflicts: [],
      message: 'No booking conflicts found'
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error checking booking conflicts:', error);
    // Return mock data instead of throwing error
    return {
      success: false,
      hasConflicts: false,
      conflicts: [],
      message: 'Failed to check conflicts'
    };
  }
};

// Get daily schedule
export const getDailySchedule = async (date, staffId = null) => {
  try {
    const params = staffId ? { staffId } : {};
    const response = await api.get(`/staff-availability/schedule/${date}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily schedule:', error);
    throw error;
  }
};

// Delete staff availability
export const deleteStaffAvailability = async (availabilityId) => {
  try {
    const response = await api.delete(`/staff-availability/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff availability:', error);
    throw error;
  }
};
