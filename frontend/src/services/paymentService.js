// frontend/src/services/paymentService.js
import api from '../utils/api';

// Get all payments for user
export const getPayments = async (params = {}) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Create a new payment
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Generate quotation for a booking
export const generateQuotation = async (quotationData) => {
  try {
    const response = await api.post('/payments/quotation', quotationData);
    return response.data;
  } catch (error) {
    console.error('Error generating quotation:', error);
    throw error;
  }
};

// Get all invoices for user
export const getInvoices = async (params = {}) => {
  try {
    const response = await api.get('/payments/invoices', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Create final invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await api.post('/payments/invoice', invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (paymentId, statusData) => {
  try {
    const response = await api.put(`/payments/${paymentId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Get payment summary for a booking
export const getPaymentSummary = async (bookingId) => {
  try {
    const response = await api.get(`/payments/booking/${bookingId}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    throw error;
  }
};

// Delete payment (admin only)
export const deletePayment = async (paymentId) => {
  try {
    const response = await api.delete(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};
