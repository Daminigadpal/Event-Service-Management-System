const mongoose = require('mongoose');
const User = require('./src/models/User.js');
const Booking = require('./src/models/Booking.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find staff user
    const staff = await User.findOne({ email: 'staff@test.com' });
    if (!staff) {
      console.log('Staff user not found');
      process.exit(1);
    }
    
    console.log('Found staff user:', staff.name, 'ID:', staff._id);
    
    // Find bookings assigned to this staff
    const staffBookings = await Booking.find({ staffAssigned: staff._id })
      .populate('customer', 'name email')
      .populate('service', 'name description price duration');
    
    console.log('Staff bookings found:', staffBookings.length);
    
    staffBookings.forEach(booking => {
      console.log('---');
      console.log('Booking ID:', booking._id);
      console.log('Customer:', booking.customer?.name);
      console.log('Service:', booking.service?.name);
      console.log('Event Type:', booking.eventType);
      console.log('Status:', booking.status);
      console.log('Date:', booking.eventDate);
      console.log('Price:', booking.quotedPrice);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
