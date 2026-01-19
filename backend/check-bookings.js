const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Get all bookings with populated data
      const bookings = await Booking.find({})
        .populate('customer', 'name email')
        .populate('service', 'name')
        .populate('staffAssigned', 'name email')
        .sort({ eventDate: 1 });

      console.log(`\n📋 Found ${bookings.length} bookings:`);
      
      if (bookings.length === 0) {
        console.log('❌ No bookings found in the system');
        console.log('💡 You need to create some bookings first to see them in the calendar');
      } else {
        bookings.forEach((booking, index) => {
          console.log(`\n${index + 1}. Booking ID: ${booking._id}`);
          console.log(`   Event Type: ${booking.eventType}`);
          console.log(`   Event Date: ${new Date(booking.eventDate).toLocaleDateString()} at ${new Date(booking.eventDate).toLocaleTimeString()}`);
          console.log(`   Location: ${booking.eventLocation || 'Not specified'}`);
          console.log(`   Customer: ${booking.customer?.name || 'Unknown'} (${booking.customer?.email || 'No email'})`);
          console.log(`   Service: ${booking.service?.name || 'Not specified'}`);
          console.log(`   Staff Assigned: ${booking.staffAssigned?.name || 'Not assigned'} (${booking.staffAssigned?.email || 'No email'})`);
          console.log(`   Status: ${booking.status}`);
          console.log(`   Created: ${new Date(booking.createdAt).toLocaleDateString()}`);
        });
      }

      // Check for today's bookings
      const today = new Date();
      const todayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        return bookingDate.toDateString() === today.toDateString();
      });

      console.log(`\n📅 Today's Bookings (${today.toDateString()}):`);
      if (todayBookings.length > 0) {
        todayBookings.forEach(booking => {
          console.log(`   ${booking.eventType} - ${new Date(booking.eventDate).toLocaleTimeString()} - ${booking.customer?.name}`);
        });
      } else {
        console.log('   No bookings scheduled for today');
      }

    } catch (error) {
      console.error('Error fetching bookings:', error);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
