const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Get the most recent booking
    const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
    
    if (latestBooking) {
      console.log('🎯 Latest Booking ID:');
      console.log(`ID: ${latestBooking._id}`);
      console.log(`Event: ${latestBooking.eventType}`);
      console.log(`Location: ${latestBooking.eventLocation}`);
      console.log(`Date: ${latestBooking.eventDate}`);
      console.log(`Status: ${latestBooking.status}`);
      console.log(`Created: ${latestBooking.createdAt}`);
    } else {
      console.log('❌ No bookings found');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
