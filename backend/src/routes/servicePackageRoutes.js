// backend/src/routes/servicePackageRoutes.js
import express from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/servicePackageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Service routes
router.route('/services')
  .get(getServices)
  .post(protect, createService);

router.route('/services/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

// Package routes
router.route('/packages')
  .get(getPackages)
  .post(protect, createPackage);

router.route('/packages/:id')
  .put(protect, updatePackage)
  .delete(protect, deletePackage);

export default router;
