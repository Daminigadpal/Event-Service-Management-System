// backend/src/routes/eventReminderRoutes.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth.js');
const {
  getReminders,
  createReminder,
  createAutomaticReminders,
  updateReminderStatus,
  deleteReminder,
  getPendingReminders
} = require('../controllers/eventReminderController.js');

const router = express.Router();

// All routes are protected
router.use(protect);

// Reminder management
router
  .route('/')
  .get(getReminders)
  .post(createReminder);

// Automatic reminders
router.post('/automatic', createAutomaticReminders);

// Update reminder status
router.put('/:id/status', updateReminderStatus);

// Delete reminder
router.delete('/:id', deleteReminder);

// Get pending reminders (for cron job - admin only)
router.get('/pending', authorize('admin'), getPendingReminders);

module.exports = router;
