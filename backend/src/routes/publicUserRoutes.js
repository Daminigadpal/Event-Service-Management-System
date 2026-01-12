// backend/src/routes/publicUserRoutes.js - Unprotected user routes
const express = require('express');
const { getUsers } = require('../controllers/userController.js');

const router = express.Router();

// Unprotected route for getting all users (for testing/admin dashboard)
router.route('/').get(getUsers);

module.exports = router;
