require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to database');
    
    // Find the logged-in user
    const user = await User.findOne({ email: 'reene2@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    console.log('Assigning bookings to user:', user.name);
    
    // Assign existing bookings to this user
    const result = await Booking.updateMany(
      { staffAssigned: { $exists: true } },
      { staffAssigned: user._id }
    );
    
    console.log('Updated', result.modifiedCount, 'bookings');
    
    // Verify the assignments
    const bookings = await Booking.find({ staffAssigned: user._id })
      .populate('customer', 'name email')
      .populate('service', 'name')
      .sort({ eventDate: 1 });
    
    console.log('\nBookings now assigned to', user.name + ':');
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.eventType} - ${booking.customer?.name} - ${booking.service?.name}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
