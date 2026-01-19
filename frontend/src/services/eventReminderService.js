// frontend/src/services/eventReminderService.js
import api from '../api';

// Get reminders for user
export const getReminders = async (params = {}) => {
  try {
    const response = await api.get('/event-reminders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

// Create event reminder
export const createReminder = async (reminderData) => {
  try {
    const response = await api.post('/event-reminders', reminderData);
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

// Create automatic reminders for a booking
export const createAutomaticReminders = async (bookingId) => {
  try {
    const response = await api.post('/event-reminders/automatic', { bookingId });
    return response.data;
  } catch (error) {
    console.error('Error creating automatic reminders:', error);
    throw error;
  }
};

// Update reminder status
export const updateReminderStatus = async (reminderId, statusData) => {
  try {
    const response = await api.put(`/event-reminders/${reminderId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating reminder status:', error);
    throw error;
  }
};

// Delete reminder
export const deleteReminder = async (reminderId) => {
  try {
    const response = await api.delete(`/event-reminders/${reminderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};
