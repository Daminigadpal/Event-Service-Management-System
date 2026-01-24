const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');
const Service = require('./src/models/Service.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find or create a test customer
    let customer = await User.findOne({ email: 'customer@test.com' });
    if (!customer) {
      customer = await User.create({
        name: 'John Smith',
        email: 'customer@test.com',
        role: 'user',
        password: 'password123',
        phone: '123-456-7890'
      });
      console.log('Created test customer:', customer.name);
    }

    // Find or create a test staff member
    let staff = await User.findOne({ email: 'staff@test.com' });
    if (!staff) {
      staff = await User.create({
        name: 'Jane Staff',
        email: 'staff@test.com',
        role: 'staff',
        password: 'password123',
        phone: '098-765-4321'
      });
      console.log('Created test staff:', staff.name);
    }

    // Find or create a test service
    let service = await Service.findOne({ name: 'Photography Service' });
    if (!service) {
      service = await Service.create({
        name: 'Photography Service',
        description: 'Professional photography for events',
        price: 1000,
        duration: 4
      });
      console.log('Created test service:', service.name);
    }

    // Create test bookings
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 30); // 30 days from now
    
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 45); // 45 days from now
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30); // 30 days ago (for completed booking)

    const testBookings = [
      {
        customer: customer._id,
        service: service._id,
        eventType: 'wedding',
        eventDate: futureDate1,
        eventLocation: 'Grand Ballroom',
        guestCount: 150,
        status: 'confirmed',
        paymentStatus: 'paid',
        quotedPrice: 5000,
        staffAssigned: staff._id,
        specialRequests: 'Special lighting setup required'
      },
      {
        customer: customer._id,
        service: service._id,
        eventType: 'corporate',
        eventDate: futureDate2,
        eventLocation: 'Conference Hall A',
        guestCount: 50,
        status: 'inquiry',
        paymentStatus: 'pending',
        quotedPrice: 3500,
        staffAssigned: staff._id,
        specialRequests: 'Client prefers natural lighting'
      },
      {
        customer: customer._id,
        service: service._id,
        eventType: 'birthday',
        eventDate: pastDate,
        eventLocation: 'Garden Area',
        guestCount: 30,
        status: 'completed',
        paymentStatus: 'paid',
        quotedPrice: 2500,
        staffAssigned: staff._id,
        specialRequests: 'Outdoor event, weather backup needed'
      }
    ];

    for (const bookingData of testBookings) {
      const booking = await Booking.create(bookingData);
      console.log('Created booking:', booking.eventType, '-', booking.status);
    }

    console.log('Test data created successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
