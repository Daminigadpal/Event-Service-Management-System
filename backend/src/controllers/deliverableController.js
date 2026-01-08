// src/controllers/deliverableController.js
const Deliverable = require('../models/Deliverable');

const deliverableController = {
  // @desc    Create a deliverable
  // @route   POST /api/deliverables
  createDeliverable: async (req, res, next) => {
    try {
      const deliverable = new Deliverable(req.body);
      await deliverable.save();
      res.status(201).json(deliverable);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get all deliverables
  // @route   GET /api/deliverables
  getDeliverables: async (req, res, next) => {
    try {
      const deliverables = await Deliverable.find().populate('booking');
      res.json(deliverables);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get single deliverable
  // @route   GET /api/deliverables/:id
  getDeliverable: async (req, res, next) => {
    try {
      const deliverable = await Deliverable.findById(req.params.id).populate('booking');
      if (!deliverable) {
        return res.status(404).json({ msg: 'Deliverable not found' });
      }
      res.json(deliverable);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update deliverable
  // @route   PUT /api/deliverables/:id
  updateDeliverable: async (req, res, next) => {
    try {
      const deliverable = await Deliverable.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('booking');
      
      if (!deliverable) {
        return res.status(404).json({ msg: 'Deliverable not found' });
      }
      res.json(deliverable);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Delete deliverable
  // @route   DELETE /api/deliverables/:id
  deleteDeliverable: async (req, res, next) => {
    try {
      const deliverable = await Deliverable.findById(req.params.id);
      if (!deliverable) {
        return res.status(404).json({ msg: 'Deliverable not found' });
      }
      await deliverable.remove();
      res.json({ msg: 'Deliverable removed' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = deliverableController;