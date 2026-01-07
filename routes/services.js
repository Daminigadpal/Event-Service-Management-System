const express = require('express');
const router = express.Router();
const { 
  getServices, 
  createService, 
  getService, 
  updateService, 
  deleteService 
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Service = require('../models/Service');

// Public routes
router.route('/')
  .get(
    advancedResults(Service, null),
    getServices
  )
  .post(
    protect, 
    authorize('admin'), 
    createService
  );

// Public route for single service
router.route('/:id')
  .get(getService);

// Protected routes (admin only)
router.use(protect, authorize('admin'));
router.route('/:id')
  .put(updateService)
  .delete(deleteService);

module.exports = router;
