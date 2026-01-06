// In serviceRoutes.js
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');  // Changed 'protect' to 'auth'
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

router
  .route('/')
  .get(getServices)
  .post(auth, admin, createService);  // Changed 'protect' to 'auth'

router
  .route('/:id')
  .get(getService)
  .put(auth, admin, updateService)    // Changed 'protect' to 'auth'
  .delete(auth, admin, deleteService); // Changed 'protect' to 'auth'

module.exports = router;