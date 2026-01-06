// src/controllers/bookingController.js
const Booking = require('../models/Booking');

const bookingController = {
  // @desc    Create a booking
  // @route   POST /api/bookings
  createBooking: async (req, res, next) => {
    try {
      const booking = new Booking(req.body);
      await booking.save();
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get all bookings
  // @route   GET /api/bookings
  getBookings: async (req, res, next) => {
    try {
      const bookings = await Booking.find().populate('user service');
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get single booking
  // @route   GET /api/bookings/:id
  getBooking: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id).populate('user service');
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update booking
  // @route   PUT /api/bookings/:id
  updateBooking: async (req, res, next) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('user service');
      
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Delete booking
  // @route   DELETE /api/bookings/:id
  deleteBooking: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
      await booking.remove();
      res.json({ msg: 'Booking removed' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = bookingController;