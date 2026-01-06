// src/controllers/serviceController.js
const Service = require('../models/Service');

const serviceController = {
  // @desc    Create a service
  // @route   POST /api/services
  createService: async (req, res, next) => {
    try {
      const service = new Service(req.body);
      await service.save();
      res.status(201).json(service);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get all services
  // @route   GET /api/services
  getServices: async (req, res, next) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get single service
  // @route   GET /api/services/:id
  getService: async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      res.json(service);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update service
  // @route   PUT /api/services/:id
  updateService: async (req, res, next) => {
    try {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      res.json(service);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Delete service
  // @route   DELETE /api/services/:id
  deleteService: async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      await service.remove();
      res.json({ msg: 'Service removed' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = serviceController;