// src/controllers/paymentController.js
const Payment = require('../models/Payment');

const paymentController = {
  // @desc    Create a payment
  // @route   POST /api/payments
  createPayment: async (req, res, next) => {
    try {
      const payment = new Payment(req.body);
      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get all payments
  // @route   GET /api/payments
  getPayments: async (req, res, next) => {
    try {
      const payments = await Payment.find().populate('booking');
      res.json(payments);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get single payment
  // @route   GET /api/payments/:id
  getPayment: async (req, res, next) => {
    try {
      const payment = await Payment.findById(req.params.id).populate('booking');
      if (!payment) {
        return res.status(404).json({ msg: 'Payment not found' });
      }
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update payment
  // @route   PUT /api/payments/:id
  updatePayment: async (req, res, next) => {
    try {
      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('booking');
      
      if (!payment) {
        return res.status(404).json({ msg: 'Payment not found' });
      }
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Delete payment
  // @route   DELETE /api/payments/:id
  deletePayment: async (req, res, next) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ msg: 'Payment not found' });
      }
      await payment.remove();
      res.json({ msg: 'Payment removed' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = paymentController;