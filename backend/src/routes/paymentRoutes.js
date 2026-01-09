import express from 'express';
import {
  getPayments,
  createPayment,
  generateQuotation,
  getInvoices,
  createInvoice,
  updatePaymentStatus,
  getPaymentSummary
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!' });
});

// Payment management
router
  .route('/')
  .get(getPayments)
  .post(createPayment);

// Quotation generation
router.post('/quotation', generateQuotation);

// Invoice management
router
  .route('/invoices')
  .get(getInvoices)
  .post(createInvoice);

// Payment status update
router.put('/:id/status', updatePaymentStatus);

// Payment summary for booking
router.get('/booking/:bookingId/summary', getPaymentSummary);

// Legacy routes for backward compatibility
router.get('/:id', (req, res) => {
  // This will be handled by the controller's getPayment function if needed
  res.status(404).json({ success: false, error: 'Route deprecated' });
});

router.put('/:id', updatePaymentStatus);
router.delete('/:id', authorize('admin'), (req, res) => {
  // This will be handled by the controller's deletePayment function
  Payment.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ success: true, message: 'Payment deleted successfully' }))
    .catch(err => res.status(400).json({ success: false, error: err.message }));
});

export default router;