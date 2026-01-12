// frontend/src/services/eventExecutionService.js
import api from '../utils/api';

// Get all event executions for user
export const getEventExecutions = async () => {
  try {
    const response = await api.get('event-executions');
    return response.data;
  } catch (error) {
    console.error('Error fetching event executions:', error);
    throw error;
  }
};

// Get all event executions (admin)
export const getAllEventExecutions = async () => {
  try {
    const response = await api.get('event-executions/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all event executions:', error);
    throw error;
  }
};

// Create event execution record
export const createEventExecution = async (executionData) => {
  try {
    const response = await api.post('event-executions', executionData);
    return response.data;
  } catch (error) {
    console.error('Error creating event execution:', error);
    throw error;
  }
};

// Mark event as completed
export const markEventCompleted = async (executionId, completionNotes) => {
  try {
    const response = await api.put(`event-executions/${executionId}/complete`, {
      completionNotes
    });
    return response.data;
  } catch (error) {
    console.error('Error marking event as completed:', error);
    throw error;
  }
};

// Upload deliverable
export const uploadDeliverable = async (executionId, deliverableData) => {
  try {
    const response = await api.post(`event-executions/${executionId}/deliverables`, deliverableData);
    return response.data;
  } catch (error) {
    console.error('Error uploading deliverable:', error);
    throw error;
  }
};

// Verify deliverable
export const verifyDeliverable = async (executionId, deliverableId, verificationNotes) => {
  try {
    const response = await api.put(`event-executions/${executionId}/deliverables/${deliverableId}/verify`, {
      verificationNotes
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying deliverable:', error);
    throw error;
  }
};

// Submit client feedback
export const submitClientFeedback = async (executionId, feedbackData) => {
  try {
    const response = await api.post(`event-executions/${executionId}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting client feedback:', error);
    throw error;
  }
};
