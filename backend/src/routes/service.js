// backend/src/routes/service.js
const express = require('express');
const { protect, authorize } = require("../middleware/auth.js");
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController.js');

const router = express.Router();

// Public route to get services
router.get('/', getServices);

// Protect all other routes
router.use(protect);
router.use(authorize('admin')); // Only admins can modify services

router.post('/', createService);
router.route('/:id')
  .put(updateService)
  .delete(deleteService);

module.exports = router;