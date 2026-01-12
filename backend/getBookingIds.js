const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const bookings = await Booking.find({});
    console.log('📋 All Booking IDs:');
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ID: ${booking._id}`);
      console.log(`   Event: ${booking.eventType}`);
      console.log(`   Location: ${booking.eventLocation}`);
      console.log(`   Date: ${booking.eventDate}`);
      console.log(`   Status: ${booking.status}`);
      console.log('');
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
