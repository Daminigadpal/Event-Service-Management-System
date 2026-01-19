// frontend/src/services/servicePackageService.js
import api from '../api';

// Get all services
export const getServices = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.type) {
      queryParams.append('type', filters.type);
    }
    
    if (filters.isActive !== undefined) {
      queryParams.append('isActive', filters.isActive);
    }
    
    const response = await api.get(`/service-packages/services?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/service-packages/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update a service
export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/service-packages/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/service-packages/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Get all packages
export const getPackages = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.isActive !== undefined) {
      queryParams.append('isActive', filters.isActive);
    }
    
    const response = await api.get(`/service-packages/packages?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

// Create a new package
export const createPackage = async (packageData) => {
  try {
    const response = await api.post('/service-packages/packages', packageData);
    return response.data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

// Update a package
export const updatePackage = async (id, packageData) => {
  try {
    const response = await api.put(`/service-packages/packages/${id}`, packageData);
    return response.data;
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

// Delete a package
export const deletePackage = async (id) => {
  try {
    const response = await api.delete(`/service-packages/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};
