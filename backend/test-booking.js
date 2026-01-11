const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find the test user we created
      const user = await User.findOne({ email: 'test@example.com' });
      if (!user) {
        console.log('Test user not found');
        return;
      }
      
      console.log('Found user:', user.name, 'ID:', user._id);
      
      // Create a test booking
      const booking = await Booking.create({
        customer: user._id,
        service: '696084c33d7a9dace9f7c48b',
        eventType: 'wedding',
        eventDate: new Date('2026-12-01'),
        eventLocation: 'goa',
        guestCount: 4,
        specialRequests: 'Test booking from server side',
        status: 'inquiry'
      });
      
      console.log('✅ Booking created successfully:');
      console.log('- ID:', booking._id);
      console.log('- Event Type:', booking.eventType);
      console.log('- Location:', booking.eventLocation);
      console.log('- Guest Count:', booking.guestCount);
      console.log('- Status:', booking.status);
      
    } catch (error) {
      console.error('❌ Error creating booking:', error.message);
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error.message);
  });
