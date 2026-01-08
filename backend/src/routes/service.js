// backend/src/routes/service.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

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

export default router;