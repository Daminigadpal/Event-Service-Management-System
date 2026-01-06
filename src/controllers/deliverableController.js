const Deliverable = require('../models/Deliverable');
const asyncHandler = require('../middleware/async');

// @desc    Get all deliverables
// @route   GET /api/deliverables
// @access  Private
const getDeliverables = asyncHandler(async (req, res) => {
  const deliverables = await Deliverable.find().populate('assignedTo', 'name email');
  res.status(200).json({ 
    success: true, 
    count: deliverables.length, 
    data: deliverables 
  });
});

// @desc    Create a deliverable
// @route   POST /api/deliverables
// @access  Private
const createDeliverable = asyncHandler(async (req, res) => {
  const { name, description, dueDate, assignedTo, status } = req.body;
  
  const deliverable = await Deliverable.create({
    name,
    description,
    dueDate,
    assignedTo,
    status: status || 'pending'
  });

  res.status(201).json({
    success: true,
    data: deliverable
  });
});

module.exports = {
  getDeliverables,
  createDeliverable
};