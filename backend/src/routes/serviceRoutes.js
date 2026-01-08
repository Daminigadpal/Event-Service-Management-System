// src/routes/serviceRoutes.js
import express from 'express';
const router = express.Router();
import * as serviceController from '../controllers/serviceController.js';

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Service routes are working!' });
});

// Service routes
router.post('/', serviceController.createService);
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;