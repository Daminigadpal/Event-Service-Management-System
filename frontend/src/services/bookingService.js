// frontend/src/services/bookingService.js
import api from '../utils/api';

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Get ALL bookings from database (Admin only)
export const getAllBookings = async () => {
  try {
    console.log(' Fetching ALL bookings from database...');
    const response = await api.get('/public-bookings');
    console.log(' All bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

// Get single booking
export const getBooking = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Update booking details
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Send quote to customer
export const sendQuote = async (bookingId, quotedPrice) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/quote`, { quotedPrice });
    return response.data;
  } catch (error) {
    console.error('Error sending quote:', error);
    throw error;
  }
};

// Confirm booking
export const confirmBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/confirm`);
    return response.data;
  } catch (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Assign staff to booking
export const assignStaffToBooking = async (bookingId, staffId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/assign-staff`, { staffId });
    return response.data;
  } catch (error) {
    console.error('Error assigning staff:', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    await api.delete(`/bookings/${bookingId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};