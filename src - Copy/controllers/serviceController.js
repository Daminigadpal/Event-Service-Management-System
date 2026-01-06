const asyncHandler = require('../middleware/async');
const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true });
  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  // Use deleteOne() instead of remove()
  await Service.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    data: {}
  });
});