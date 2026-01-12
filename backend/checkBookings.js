const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const bookings = await Booking.find({})
      .populate('customer', 'name email')
      .populate('service', 'name')
      .populate('staffAssigned', 'name email');
    
    console.log('Bookings in DB:', bookings.length);
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.eventType} - ${booking.eventLocation} - ${booking.status}`);
      console.log(`   Customer: ${booking.customer?.name || 'None'} (${booking.customer?.email || 'None'})`);
      console.log(`   Service: ${booking.service?.name || 'None'}`);
      console.log(`   Staff: ${booking.staffAssigned?.name || 'None'}`);
      console.log(`   Date: ${booking.eventDate}`);
      console.log('');
    });

    if (bookings.length === 0) {
      console.log('❌ No bookings found in database');
      console.log('📝 Creating sample bookings...');
      
      // Create sample bookings
      const User = require('./src/models/User.js');
      const Service = require('./src/models/Service.js');
      
      const adminUser = await User.findOne({ email: 'sejal@gmail.com' });
      const staffUser = await User.findOne({ email: 'staff@gmail.com' });
      
      const sampleBookings = [
        {
          customer: adminUser._id,
          service: '696084c33d7a9dace9f7c48b', // Wedding Planning service
          eventType: 'wedding',
          eventDate: new Date('2026-01-15'),
          eventLocation: 'Grand Ballroom',
          guestCount: 150,
          specialRequests: 'Outdoor ceremony preferred',
          status: 'confirmed',
          quotedPrice: 15000,
          confirmationDate: new Date()
        },
        {
          customer: staffUser._id,
          service: '696084c33d7a9dace9f7c48b',
          eventType: 'birthday',
          eventDate: new Date('2026-01-20'),
          eventLocation: 'Garden Party Area',
          guestCount: 50,
          specialRequests: 'Kids entertainment needed',
          status: 'inquiry'
        },
        {
          customer: adminUser._id,
          service: '696084c33d7a9dace9f7c48b',
          eventType: 'corporate',
          eventDate: new Date('2026-01-25'),
          eventLocation: 'Conference Hall',
          guestCount: 100,
          specialRequests: 'AV equipment required',
          status: 'quoted',
          quotedPrice: 8000,
          quotedAt: new Date()
        }
      ];
      
      await Booking.insertMany(sampleBookings);
      console.log('✅ Sample bookings created successfully');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
