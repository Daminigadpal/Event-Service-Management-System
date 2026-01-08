// backend/src/controllers/serviceController.js
import Service from '../models/Service.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private/Admin
export const updateService = async (req, res, next) => {
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
export const deleteService = async (req, res, next) => {
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