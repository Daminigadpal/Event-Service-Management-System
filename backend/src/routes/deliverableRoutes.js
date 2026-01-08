// src/routes/deliverableRoutes.js
const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Deliverable routes are working!' });
});

// Deliverable routes
router.post('/', deliverableController.createDeliverable);
router.get('/', deliverableController.getDeliverables);
router.get('/:id', deliverableController.getDeliverable);
router.put('/:id', deliverableController.updateDeliverable);
router.delete('/:id', deliverableController.deleteDeliverable);

module.exports = router;