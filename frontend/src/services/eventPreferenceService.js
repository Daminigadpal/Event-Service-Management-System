// frontend/src/services/eventPreferenceService.js
import api from '../utils/api';

// Get all event preferences
export const getEventPreferences = async () => {
  try {
    console.log('Making GET request to /event-preferences');
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);
    
    // Check if user is admin and use admin endpoint
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';
    console.log('User data:', user);
    console.log('Is admin:', isAdmin);
    
    const endpoint = isAdmin ? 'event-preferences/all' : 'event-preferences';
    console.log(`Using ${isAdmin ? 'admin' : 'user'} endpoint: ${endpoint}`);
    
    // Add cache-busting timestamp
    const timestamp = new Date().getTime();
    const response = await api.get(`${endpoint}?_t=${timestamp}`);
    console.log('GET request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    console.error('Full error object:', error);
    throw error; // Don't use mock data, show real error
  }
};

// Create a new event preference
export const createEventPreference = async (preferenceData) => {
  try {
    console.log('DEBUG: Creating event preference with original data:', JSON.stringify(preferenceData, null, 2));

    // Transform data to match backend expectations
    const transformedData = {
      ...preferenceData,
      eventType: preferenceData.eventType?.toLowerCase(),
      budgetRange: (() => {
        console.log('DEBUG: parsing budgetRange in service:', preferenceData.budgetRange);
        const [min, max] = preferenceData.budgetRange.split('-').map(s => parseInt(s.replace('$', '')));
        console.log('DEBUG: parsed min, max in service:', min, max);
        return { min, max };
      })(),
      guestCount: (() => {
        console.log('DEBUG: parsing guestCount in service:', preferenceData.guestCount);
        if (preferenceData.guestCount.includes('-')) {
          const result = parseInt(preferenceData.guestCount.split('-')[1]);
          console.log('DEBUG: parsed guestCount from range in service:', result);
          return result;
        } else if (preferenceData.guestCount.includes('+')) {
          const result = parseInt(preferenceData.guestCount.replace('+', ''));
          console.log('DEBUG: parsed guestCount from + in service:', result);
          return result;
        } else {
          const result = parseInt(preferenceData.guestCount);
          console.log('DEBUG: parsed guestCount direct in service:', result);
          return result;
        }
      })()
    };

    console.log('DEBUG: Transformed data in service:', JSON.stringify(transformedData, null, 2));

    // Use direct URL to bypass proxy cache issues
    const response = await api.post('event-preferences', transformedData);
    console.log('DEBUG: Event preference created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error creating event preference:', error);
    console.error('DEBUG: Error response status:', error.response?.status);
    console.error('DEBUG: Error response data:', error.response?.data);
    // If it's a 500 error, provide a helpful message
    if (error.response?.status === 500) {
      console.error('Backend error - this might be due to MongoDB connection issues');
    }
    throw error;
  }
};

// Update an event preference
export const updateEventPreference = async (preferenceData) => {
  try {
    console.log('DEBUG: Updating event preference with original data:', JSON.stringify(preferenceData, null, 2));

    // Transform data to match backend expectations
    const transformedData = {
      ...preferenceData,
      eventType: preferenceData.eventType?.toLowerCase(),
      budgetRange: (() => {
        console.log('DEBUG: parsing budgetRange in update service:', preferenceData.budgetRange);
        const [min, max] = preferenceData.budgetRange.split('-').map(s => parseInt(s.replace('$', '')));
        console.log('DEBUG: parsed min, max in update service:', min, max);
        return { min, max };
      })(),
      guestCount: (() => {
        console.log('DEBUG: parsing guestCount in update service:', preferenceData.guestCount);
        if (preferenceData.guestCount.includes('-')) {
          const result = parseInt(preferenceData.guestCount.split('-')[1]);
          console.log('DEBUG: parsed guestCount from range in update service:', result);
          return result;
        } else if (preferenceData.guestCount.includes('+')) {
          const result = parseInt(preferenceData.guestCount.replace('+', ''));
          console.log('DEBUG: parsed guestCount from + in update service:', result);
          return result;
        } else {
          const result = parseInt(preferenceData.guestCount);
          console.log('DEBUG: parsed guestCount direct in update service:', result);
          return result;
        }
      })()
    };

    console.log('DEBUG: Transformed data in update service:', JSON.stringify(transformedData, null, 2));

    // Use direct URL to bypass proxy cache issues
    const response = await api.put('event-preferences', transformedData);
    console.log('DEBUG: Event preference updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('DEBUG: Error updating event preference:', error);
    console.error('DEBUG: Error response status:', error.response?.status);
    console.error('DEBUG: Error response data:', error.response?.data);
    throw error;
  }
};

// Delete an event preference
export const deleteEventPreference = async (id) => {
  try {
    await api.delete(`event-preferences/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event preference:', error);
    throw error;
  }
};