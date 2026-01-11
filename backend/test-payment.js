const mongoose = require('mongoose');
const Payment = require('./src/models/Payment.js');
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
      
      console.log('Found user:', user.name, 'ID:', user._id);
      
      // Find or create a test booking
      let booking = await Booking.findOne({ customer: user._id });
      if (!booking) {
        console.log('Creating test booking...');
        booking = await Booking.create({
          customer: user._id,
          service: '696084c33d7a9dace9f7c48b',
          eventType: 'wedding',
          eventDate: new Date('2026-12-01'),
          eventLocation: 'test location',
          guestCount: 50,
          specialRequests: 'Test booking for payment',
          status: 'confirmed'
        });
        console.log('✅ Test booking created:', booking._id);
      } else {
        console.log('Using existing booking:', booking._id);
      }
      
      // Create a test payment
      const payment = await Payment.create({
        booking: booking._id,
        user: user._id,
        paymentType: 'full',
        amount: 25000,
        paymentMethod: 'credit_card',
        transactionId: 'TXN' + Date.now(),
        notes: 'Test payment from server side',
        status: 'paid',
        paymentDate: new Date(),
        receiptNumber: 'RCP' + Date.now()
      });
      
      console.log('✅ Payment created successfully:');
      console.log('- ID:', payment._id);
      console.log('- Booking ID:', payment.booking);
      console.log('- Amount:', payment.amount);
      console.log('- Payment Method:', payment.paymentMethod);
      console.log('- Status:', payment.status);
      console.log('- Receipt Number:', payment.receiptNumber);
      
    } catch (error) {
      console.error('❌ Error creating payment:', error.message);
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error.message);
  });
