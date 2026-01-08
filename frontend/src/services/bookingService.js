// frontend/src/services/bookingService.js
import api from '../utils/api';

// Mock data for fallback
const mockBookings = [
  { 
    id: 1, 
    eventType: 'Wedding', 
    date: '2023-06-15', 
    status: 'Completed', 
    amount: 5000,
    guests: 150,
    staff: 'John Doe',
    requirements: 'Outdoor ceremony, vegetarian menu required'
  },
  { 
    id: 2, 
    eventType: 'Conference', 
    date: '2023-08-22', 
    status: 'Confirmed', 
    amount: 3000,
    guests: 200,
    staff: 'Jane Smith',
    requirements: 'Need projector and sound system'
  },
];

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.warn('Using mock data due to API error:', error.message);
    return { success: true, data: mockBookings };
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

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
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