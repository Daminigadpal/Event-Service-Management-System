// backend/src/controllers/servicePackageController.js
import ErrorResponse from '../utils/errorResponse.js';

// Mock data for testing without MongoDB
let mockServices = [];
let mockPackages = [];

// Define asyncHandler directly in the file
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Initialize mock data
const initializeMockData = () => {
  if (mockServices.length === 0) {
    mockServices = [
      {
        _id: 'service_1',
        name: 'Photography',
        description: 'Professional photography service for events',
        type: 'Photography',
        basePrice: 5000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'service_2',
        name: 'Videography',
        description: 'Professional videography service for events',
        type: 'Videography',
        basePrice: 8000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'service_3',
        name: 'Decoration',
        description: 'Event decoration and setup service',
        type: 'Decoration',
        basePrice: 3000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'service_4',
        name: 'Catering',
        description: 'Full catering service for events',
        type: 'Catering',
        basePrice: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  if (mockPackages.length === 0) {
    mockPackages = [
      {
        _id: 'package_1',
        name: 'Basic Package',
        description: 'Essential services for small events',
        includedServices: ['service_1', 'service_3'],
        duration: 4,
        price: 8000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'package_2',
        name: 'Premium Package',
        description: 'Complete services for medium events',
        includedServices: ['service_1', 'service_2', 'service_3'],
        duration: 6,
        price: 16000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'package_3',
        name: 'Luxury Package',
        description: 'All services for large events',
        includedServices: ['service_1', 'service_2', 'service_3', 'service_4'],
        duration: 8,
        price: 26000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
};

// Initialize mock data
initializeMockData();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req, res, next) => {
  try {
    const { type, isActive } = req.query;
    
    let filteredServices = [...mockServices];
    
    if (type) {
      filteredServices = filteredServices.filter(service => 
        service.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      filteredServices = filteredServices.filter(service => 
        service.isActive === activeStatus
      );
    }
    
    res.status(200).json({
      success: true,
      count: filteredServices.length,
      data: filteredServices
    });
  } catch (error) {
    return next(new ErrorResponse('Error fetching services', 500));
  }
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private
export const createService = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, type, basePrice } = req.body;
    
    if (!name || !description || !type || !basePrice) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }
    
    const newService = {
      _id: `service_${Date.now()}`,
      name,
      description,
      type,
      basePrice: parseFloat(basePrice),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockServices.push(newService);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    return next(new ErrorResponse('Error creating service', 500));
  }
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, type, basePrice, isActive } = req.body;
    
    const serviceIndex = mockServices.findIndex(service => service._id === id);
    
    if (serviceIndex === -1) {
      return next(new ErrorResponse('Service not found', 404));
    }
    
    const updatedService = {
      ...mockServices[serviceIndex],
      name: name || mockServices[serviceIndex].name,
      description: description || mockServices[serviceIndex].description,
      type: type || mockServices[serviceIndex].type,
      basePrice: basePrice ? parseFloat(basePrice) : mockServices[serviceIndex].basePrice,
      isActive: isActive !== undefined ? isActive : mockServices[serviceIndex].isActive,
      updatedAt: new Date()
    };
    
    mockServices[serviceIndex] = updatedService;
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    return next(new ErrorResponse('Error updating service', 500));
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const serviceIndex = mockServices.findIndex(service => service._id === id);
    
    if (serviceIndex === -1) {
      return next(new ErrorResponse('Service not found', 404));
    }
    
    mockServices.splice(serviceIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    return next(new ErrorResponse('Error deleting service', 500));
  }
});

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    let filteredPackages = [...mockPackages];
    
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      filteredPackages = filteredPackages.filter(pkg => 
        pkg.isActive === activeStatus
      );
    }
    
    // Populate included services
    const packagesWithServices = filteredPackages.map(pkg => ({
      ...pkg,
      includedServices: pkg.includedServices.map(serviceId => 
        mockServices.find(service => service._id === serviceId)
      ).filter(Boolean)
    }));
    
    res.status(200).json({
      success: true,
      count: packagesWithServices.length,
      data: packagesWithServices
    });
  } catch (error) {
    return next(new ErrorResponse('Error fetching packages', 500));
  }
});

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private
export const createPackage = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, includedServices, duration, price } = req.body;
    
    if (!name || !includedServices || !duration || !price) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }
    
    const newPackage = {
      _id: `package_${Date.now()}`,
      name,
      description,
      includedServices: Array.isArray(includedServices) ? includedServices : [includedServices],
      duration: parseInt(duration),
      price: parseFloat(price),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockPackages.push(newPackage);
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: newPackage
    });
  } catch (error) {
    return next(new ErrorResponse('Error creating package', 500));
  }
});

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private
export const updatePackage = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, includedServices, duration, price, isActive } = req.body;
    
    const packageIndex = mockPackages.findIndex(pkg => pkg._id === id);
    
    if (packageIndex === -1) {
      return next(new ErrorResponse('Package not found', 404));
    }
    
    const updatedPackage = {
      ...mockPackages[packageIndex],
      name: name || mockPackages[packageIndex].name,
      description: description || mockPackages[packageIndex].description,
      includedServices: includedServices ? 
        (Array.isArray(includedServices) ? includedServices : [includedServices]) : 
        mockPackages[packageIndex].includedServices,
      duration: duration ? parseInt(duration) : mockPackages[packageIndex].duration,
      price: price ? parseFloat(price) : mockPackages[packageIndex].price,
      isActive: isActive !== undefined ? isActive : mockPackages[packageIndex].isActive,
      updatedAt: new Date()
    };
    
    mockPackages[packageIndex] = updatedPackage;
    
    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage
    });
  } catch (error) {
    return next(new ErrorResponse('Error updating package', 500));
  }
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private
export const deletePackage = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const packageIndex = mockPackages.findIndex(pkg => pkg._id === id);
    
    if (packageIndex === -1) {
      return next(new ErrorResponse('Package not found', 404));
    }
    
    mockPackages.splice(packageIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    return next(new ErrorResponse('Error deleting package', 500));
  }
});
