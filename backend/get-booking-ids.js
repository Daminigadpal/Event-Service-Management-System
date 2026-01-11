const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find test user
      const user = await User.findOne({ email: 'test@example.com' });
      if (!user) {
        console.log('Test user not found');
        return;
      }
      
      // Find all bookings for this user
      const bookings = await Booking.find({ customer: user._id })
        .sort({ eventDate: -1 })
        .populate('customer', 'name email');
      
      console.log('Found bookings for user:', bookings.length);
      
      if (bookings.length > 0) {
        console.log('\n=== AVAILABLE BOOKING IDs ===');
        bookings.forEach((booking, index) => {
          console.log(`${index + 1}. Booking ID: ${booking._id}`);
          console.log(`   Event Type: ${booking.eventType}`);
          console.log(`   Event Date: ${booking.eventDate}`);
          console.log(`   Event Location: ${booking.eventLocation}`);
          console.log(`   Status: ${booking.status}`);
          console.log(`   Created: ${booking.createdAt}`);
          console.log('---');
        });
      } else {
        console.log('No bookings found for this user');
      }
      
    } catch (error) {
      console.error('❌ Error fetching bookings:', error.message);
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error.message);
  });
