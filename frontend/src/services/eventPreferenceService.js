// frontend/src/services/eventPreferenceService.js
import api from '../api';

// Get event preferences for current user
export const getEventPreferences = async () => {
  try {
    console.log('Making GET request to /event-preferences for user data');

    const response = await api.get('event-preferences');
    console.log('GET request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    console.error('Full error object:', error);
    throw error;
  }
};

// Get all event preferences (admin only)
export const getAllEventPreferences = async () => {
  try {
    console.log('Making GET request to /event-preferences/all for admin data');

    const response = await api.get('event-preferences/all');
    console.log('GET all request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('GET all request failed:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    console.error('Full error object:', error);
    throw error;
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
        console.log('DEBUG: parsing guestCount in update service:', preferenceData.guestCount, 'type:', typeof preferenceData.guestCount);
        const guestCountValue = preferenceData.guestCount;
        
        // Convert to string if it's a number
        const guestCountStr = typeof guestCountValue === 'number' ? guestCountValue.toString() : guestCountValue;
        
        if (guestCountStr.includes('-')) {
          const result = parseInt(guestCountStr.split('-')[1]);
          console.log('DEBUG: parsed guestCount from range in update service:', result);
          return result;
        } else if (guestCountStr.includes('+')) {
          const result = parseInt(guestCountStr.replace('+', ''));
          console.log('DEBUG: parsed guestCount from + in update service:', result);
          return result;
        } else {
          const result = parseInt(guestCountStr);
          console.log('DEBUG: parsed guestCount direct in update service:', result);
          return result;
        }
      })(),
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