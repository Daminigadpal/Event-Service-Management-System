// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// User management routes (temporarily removing auth for testing)
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;