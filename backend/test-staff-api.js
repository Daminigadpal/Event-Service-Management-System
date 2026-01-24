require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.js');
const Booking = require('./src/models/Booking.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find staff user and simulate the getBookings controller logic
    const staff = await User.findOne({ email: 'staff@test.com' });
    if (!staff) {
      console.log('Staff user not found');
      process.exit(1);
    }
    
    console.log('Simulating staff booking fetch for:', staff.name);
    
    // Simulate the getBookings controller logic for staff
    const bookings = await Booking.find({ staffAssigned: staff._id })
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration')
      .sort({ eventDate: 1 });

    console.log('Found bookings:', bookings.length);
    
    // Transform data like the frontend expects
    const transformedBookings = bookings.map(booking => ({
      id: booking._id,
      customerName: booking.customer?.name || 'Unknown Customer',
      eventName: booking.eventType || 'Event',
      date: new Date(booking.eventDate).toISOString().split('T')[0],
      time: new Date(booking.eventDate).toTimeString().split(' ')[0].substring(0, 5),
      location: booking.eventLocation || 'TBD',
      status: booking.status || 'inquiry',
      services: booking.service ? [booking.service.name] : ['General Service'],
      paymentStatus: booking.paymentStatus || 'pending',
      amount: booking.quotedPrice || 0,
      customerRating: 0,
      notes: booking.specialRequests || booking.internalNotes || '',
      service: booking.service,
      customer: booking.customer,
      specialRequests: booking.specialRequests,
      internalNotes: booking.internalNotes
    }));

    console.log('\n=== TRANSFORMED BOOKING DATA ===');
    transformedBookings.forEach((booking, index) => {
      console.log(`\nBooking ${index + 1}:`);
      console.log('  ID:', booking.id);
      console.log('  Customer:', booking.customerName);
      console.log('  Event:', booking.eventName);
      console.log('  Date:', booking.date);
      console.log('  Time:', booking.time);
      console.log('  Location:', booking.location);
      console.log('  Status:', booking.status);
      console.log('  Services:', booking.services.join(', '));
      console.log('  Payment:', booking.paymentStatus);
      console.log('  Amount:', booking.amount);
      console.log('  Notes:', booking.notes);
    });
    
    // Calculate statistics like the frontend
    const completed = transformedBookings.filter(b => b.status === 'completed').length;
    const pending = transformedBookings.filter(b => b.status === 'inquiry' || b.status === 'pending').length;
    const confirmed = transformedBookings.filter(b => b.status === 'confirmed').length;
    const upcoming = transformedBookings.filter(b => new Date(b.date) > new Date()).length;
    const totalEarnings = transformedBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    console.log('\n=== CALCULATED STATISTICS ===');
    console.log('Total bookings:', transformedBookings.length);
    console.log('Completed:', completed);
    console.log('Pending:', pending);
    console.log('Confirmed:', confirmed);
    console.log('Upcoming:', upcoming);
    console.log('Total earnings:', totalEarnings);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
