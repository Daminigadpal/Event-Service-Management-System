// backend/src/controllers/eventExecutionController.js
const EventExecution = require('../models/EventExecution.js');
const Booking = require('../models/Booking.js');
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all event executions for a user
// @route   GET /api/v1/event-executions
// @access  Private
const getEventExecutions = asyncHandler(async (req, res, next) => {
  const executions = await EventExecution.find({ user: req.user.id })
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('deliverables.uploadedBy', 'name email')
    .populate('deliverables.verifiedBy', 'name email')
    .populate('staffAssigned', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: executions.length,
    data: executions
  });
});

// @desc    Get all event executions (admin)
// @route   GET /api/v1/event-executions/all
// @access  Private/Admin
const getAllEventExecutions = asyncHandler(async (req, res, next) => {
  const executions = await EventExecution.find({})
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('user', 'name email')
    .populate('deliverables.uploadedBy', 'name email')
    .populate('deliverables.verifiedBy', 'name email')
    .populate('staffAssigned', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: executions.length,
    data: executions
  });
});

// @desc    Create event execution record
// @route   POST /api/v1/event-executions
// @access  Private
const createEventExecution = asyncHandler(async (req, res, next) => {
  const { bookingId, staffAssigned, notes } = req.body;

  // Check if execution already exists for this booking
  const existingExecution = await EventExecution.findOne({ booking: bookingId });
  if (existingExecution) {
    return next(new ErrorResponse('Event execution already exists for this booking', 400));
  }

  // Verify booking exists and belongs to user
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Create execution record
  const execution = await EventExecution.create({
    booking: bookingId,
    user: req.user.id,
    staffAssigned: staffAssigned || [],
    notes: notes || ''
  });

  const populatedExecution = await EventExecution.findById(execution._id)
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('staffAssigned', 'name email');

  res.status(201).json({
    success: true,
    message: 'Event execution created successfully',
    data: populatedExecution
  });
});

// @desc    Mark event as completed
// @route   PUT /api/v1/event-executions/:id/complete
// @access  Private
const markEventCompleted = asyncHandler(async (req, res, next) => {
  const { completionNotes } = req.body;

  let execution = await EventExecution.findById(req.params.id);
  if (!execution) {
    return next(new ErrorResponse('Event execution not found', 404));
  }

  // Check ownership
  if (execution.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this execution', 403));
  }

  // Update status to completed
  execution = await EventExecution.findByIdAndUpdate(
    req.params.id,
    {
      status: 'completed',
      completionDate: new Date(),
      notes: completionNotes ? execution.notes + '\n\nCompletion Notes: ' + completionNotes : execution.notes
    },
    { new: true, runValidators: false }
  ).populate('booking', 'eventType eventDate eventLocation')
   .populate('staffAssigned', 'name email');

  res.status(200).json({
    success: true,
    message: 'Event marked as completed successfully',
    data: execution
  });
});

// @desc    Upload deliverable
// @route   POST /api/v1/event-executions/:id/deliverables
// @access  Private
const uploadDeliverable = asyncHandler(async (req, res, next) => {
  const { name, description, fileUrl, fileType, fileSize } = req.body;

  let execution = await EventExecution.findById(req.params.id);
  if (!execution) {
    return next(new ErrorResponse('Event execution not found', 404));
  }

  // Check ownership
  if (execution.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this execution', 403));
  }

  // Add deliverable
  const newDeliverable = {
    name,
    description,
    fileUrl,
    fileType,
    fileSize,
    status: 'completed',
    uploadDate: new Date(),
    uploadedBy: req.user.id
  };

  execution.deliverables.push(newDeliverable);
  execution.totalDeliverables = execution.deliverables.length;
  execution.completedDeliverables = execution.deliverables.filter(d => d.status === 'completed').length;

  await execution.save();

  const updatedExecution = await EventExecution.findById(execution._id)
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('deliverables.uploadedBy', 'name email')
    .populate('staffAssigned', 'name email');

  res.status(200).json({
    success: true,
    message: 'Deliverable uploaded successfully',
    data: updatedExecution
  });
});

// @desc    Verify deliverable
// @route   PUT /api/v1/event-executions/:id/deliverables/:deliverableId/verify
// @access  Private
const verifyDeliverable = asyncHandler(async (req, res, next) => {
  const { verificationNotes } = req.body;

  let execution = await EventExecution.findById(req.params.id);
  if (!execution) {
    return next(new ErrorResponse('Event execution not found', 404));
  }

  // Check ownership
  if (execution.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this execution', 403));
  }

  // Find and update deliverable
  const deliverable = execution.deliverables.id(req.params.deliverableId);
  if (!deliverable) {
    return next(new ErrorResponse('Deliverable not found', 404));
  }

  deliverable.status = 'verified';
  deliverable.verificationDate = new Date();
  deliverable.verifiedBy = req.user.id;

  execution.verifiedDeliverables = execution.deliverables.filter(d => d.status === 'verified').length;

  await execution.save();

  const updatedExecution = await EventExecution.findById(execution._id)
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('deliverables.uploadedBy', 'name email')
    .populate('deliverables.verifiedBy', 'name email')
    .populate('staffAssigned', 'name email');

  res.status(200).json({
    success: true,
    message: 'Deliverable verified successfully',
    data: updatedExecution
  });
});

// @desc    Submit client feedback
// @route   POST /api/v1/event-executions/:id/feedback
// @access  Private
const submitClientFeedback = asyncHandler(async (req, res, next) => {
  const { rating, comments, wouldRecommend, suggestions } = req.body;

  let execution = await EventExecution.findById(req.params.id);
  if (!execution) {
    return next(new ErrorResponse('Event execution not found', 404));
  }

  // Check ownership
  if (execution.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this execution', 403));
  }

  // Add or update feedback
  execution.clientFeedback = {
    rating,
    comments,
    wouldRecommend,
    suggestions,
    feedbackDate: new Date()
  };

  await execution.save();

  const updatedExecution = await EventExecution.findById(execution._id)
    .populate('booking', 'eventType eventDate eventLocation')
    .populate('staffAssigned', 'name email');

  res.status(200).json({
    success: true,
    message: 'Client feedback submitted successfully',
    data: updatedExecution
  });
});

module.exports = {
  getEventExecutions,
  getAllEventExecutions,
  createEventExecution,
  markEventCompleted,
  uploadDeliverable,
  verifyDeliverable,
  submitClientFeedback
};
