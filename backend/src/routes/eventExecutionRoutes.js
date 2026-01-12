// backend/src/routes/eventExecutionRoutes.js
const express = require('express');
const {
  getEventExecutions,
  getAllEventExecutions,
  createEventExecution,
  markEventCompleted,
  uploadDeliverable,
  verifyDeliverable,
  submitClientFeedback
} = require('../controllers/eventExecutionController.js');

const router = express.Router();

// Middleware to protect routes
const { protect } = require('../middleware/auth.js');
const { authorize } = require('../middleware/auth.js');

router.use(protect);

// Regular user routes
router.route('/')
  .get(getEventExecutions)
  .post(createEventExecution);

// Admin only routes
router.get('/all', authorize('admin'), getAllEventExecutions);

// Event completion
router.put('/:id/complete', markEventCompleted);

// Deliverable management
router.post('/:id/deliverables', uploadDeliverable);
router.put('/:id/deliverables/:deliverableId/verify', verifyDeliverable);

// Client feedback
router.post('/:id/feedback', submitClientFeedback);

module.exports = router;
