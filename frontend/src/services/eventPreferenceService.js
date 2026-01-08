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
    const response = await api.get('/event-preferences');
    return response.data;
  } catch (error) {
    console.warn('Using mock data due to API error:', error.message);
    return { success: true, data: mockEventPreferences };
  }
};

// Create a new event preference
export const createEventPreference = async (preferenceData) => {
  try {
    const response = await api.post('/event-preferences', preferenceData);
    return response.data;
  } catch (error) {
    console.error('Error creating event preference:', error);
    throw error;
  }
};

// Update an event preference
export const updateEventPreference = async (id, preferenceData) => {
  try {
    const response = await api.put(`/event-preferences/${id}`, preferenceData);
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