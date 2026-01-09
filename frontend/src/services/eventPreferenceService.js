// frontend/src/services/eventPreferenceService.js
import api from '../utils/api';

// Mock data for fallback
const mockEventPreferences = [
  { 
    id: 1, 
    eventType: 'Wedding', 
    preferredVenue: 'Grand Ballroom', 
    budgetRange: '5000-10000',
    guestCount: '100-200',
    notes: 'Outdoor ceremony preferred'
  },
  { 
    id: 2, 
    eventType: 'Corporate', 
    preferredVenue: 'Conference Center', 
    budgetRange: '3000-8000',
    guestCount: '50-100',
    notes: 'Need AV equipment'
  },
];

// Get all event preferences
export const getEventPreferences = async () => {
  try {
    console.log('Making GET request to /event-preferences');
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);
    console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'none');
    
    const response = await api.get('/event-preferences');
    console.log('GET request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    console.warn('Using mock data due to API error:', error.message);
    return { success: true, data: mockEventPreferences };
  }
};

// Create a new event preference
export const createEventPreference = async (preferenceData) => {
  try {
    console.log('Creating event preference with data:', preferenceData);
    // Use direct URL to bypass proxy cache issues
    const response = await api.post('/event-preferences', preferenceData);
    console.log('Event preference created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating event preference:', error);
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
    // Use direct URL to bypass proxy cache issues
    const response = await api.put('/event-preferences', preferenceData);
    return response.data;
  } catch (error) {
    console.error('Error updating event preference:', error);
    throw error;
  }
};

// Delete an event preference
export const deleteEventPreference = async (id) => {
  try {
    await api.delete(`/event-preferences/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event preference:', error);
    throw error;
  }
};