const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Test route without any middleware
router.post('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test route working' });
});

// Routes with only the basic controller (no middleware)
router.post('/', (req, res) => scheduleController.createSchedule(req, res));
router.get('/:staffId', (req, res) => scheduleController.getStaffSchedule(req, res));
router.put('/:id', (req, res) => scheduleController.updateSchedule(req, res));
router.delete('/:id', (req, res) => scheduleController.deleteSchedule(req, res));

module.exports = router;