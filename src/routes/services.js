const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
