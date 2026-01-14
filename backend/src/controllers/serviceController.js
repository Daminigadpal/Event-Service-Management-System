// backend/src/controllers/serviceController.js
const Service = require('../models/Service.js');
const ErrorResponse = require('../utils/errorResponse.js');

// Mock data for testing without MongoDB
const mockServices = [
  {
    _id: '696084c33d7a9dace9f7c48b',
    name: 'Wedding Package',
    description: 'Complete wedding decoration and catering',
    price: 40000,
    duration: 8
  },
  {
    _id: '696084c33d7a9dace9f7c48c',
    name: 'Birthday Party Package',
    description: 'Complete birthday party arrangement',
    price: 25000,
    duration: 4
  }
];

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
const getServices = async (req, res, next) => {
  // Return mock services for testing
  res.status(200).json({ 
    success: true, 
    count: mockServices.length, 
    data: mockServices 
  });
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) {
      return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};