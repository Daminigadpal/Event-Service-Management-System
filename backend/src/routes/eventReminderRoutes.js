// backend/src/routes/eventReminderRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getReminders,
  createReminder,
  createAutomaticReminders,
  updateReminderStatus,
  deleteReminder,
  getPendingReminders
} from '../controllers/eventReminderController.js';

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

export default router;
