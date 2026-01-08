const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch events. Please try again.'
    });
  }
});

// @route   POST /api/events
// @desc    Create an event
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Please include a description').not().isEmpty(),
    check('date', 'Please include a valid date').optional().isISO8601()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { name, description, date, location } = req.body;
      
      const newEvent = new Event({
        name,
        description,
        date: date || Date.now(),
        location: location || ''
      });

      const event = await newEvent.save();
      
      res.status(201).json({
        success: true,
        data: event
      });
    } catch (err) {
      console.error('Error creating event:', err.message);
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Failed to create event. Please try again.'
      });
    }
  }
);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    console.error('Error fetching event:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch event. Please try again.'
    });
  }
});

module.exports = router;
