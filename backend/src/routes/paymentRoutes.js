const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!' });
});

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;