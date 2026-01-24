const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to MongoDB');
    const bookings = await Booking.find({}).populate('customer', 'name').populate('service', 'name');
    console.log('Total bookings:', bookings.length);
    bookings.forEach(b => {
      console.log(`- ${b._id}: ${b.customer?.name || 'No customer'} - ${b.service?.name || 'No service'} - ${b.status}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
