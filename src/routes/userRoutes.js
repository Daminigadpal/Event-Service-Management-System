const express = require('express');
const router = express.Router();
console.log('User routes loaded');  // Add this line

const { auth, admin } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Protect all routes with authentication
router.use(auth);

// Admin-only routes
router.get('/', admin, getUsers);
router.get('/:id', admin, getUser);
router.put('/:id', admin, updateUser);
router.delete('/:id', admin, deleteUser);

module.exports = router;