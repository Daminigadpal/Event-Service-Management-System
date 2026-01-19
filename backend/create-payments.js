const mongoose = require('mongoose');

async function checkBookingsAndCreatePayments() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('Connected to MongoDB');
    
    // Check existing bookings
    const Booking = mongoose.connection.db.collection('bookings');
    const bookings = await Booking.find({}).toArray();
    
    console.log('=== EXISTING BOOKINGS ===');
    if (bookings.length === 0) {
      console.log('No bookings found');
    } else {
      bookings.forEach((booking, index) => {
        console.log(`${index + 1}. Booking ID: ${booking._id}`);
        console.log(`   Event Type: ${booking.eventType}`);
        console.log(`   Status: ${booking.status}`);
        console.log(`   Event Date: ${booking.eventDate}`);
        console.log('---');
      });
    }
    
    // Create payments if bookings exist
    if (bookings.length > 0) {
      const Payment = mongoose.connection.db.collection('payments');
      
      for (let i = 0; i < Math.min(3, bookings.length); i++) {
        const booking = bookings[i];
        const paymentData = {
          booking: booking._id,
          amount: Math.floor(Math.random() * 5000) + 1000, // Random amount between 1000-6000
          paymentMethod: ['credit_card', 'bank_transfer', 'cash'][i % 3],
          status: ['completed', 'pending', 'partial'][i % 3],
          paymentDate: new Date().toISOString().split('T')[0],
          transactionId: 'TXN' + Date.now() + String(i + 1).padStart(3, '0'),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        try {
          const result = await Payment.insertOne(paymentData);
          console.log(`✅ Created payment with ID: ${result.insertedId}`);
          console.log(`   Amount: ${paymentData.amount}`);
          console.log(`   Status: ${paymentData.status}`);
          console.log(`   Booking ID: ${paymentData.booking}`);
          console.log('---');
        } catch (error) {
          console.log(`❌ Failed to create payment: ${error.message}`);
        }
      }
    }
    
    // Now get all payments
    console.log('\n=== ALL PAYMENTS AFTER CREATION ===');
    const payments = await Payment.find({}).toArray();
    
    if (payments.length === 0) {
      console.log('No payments found in database');
    } else {
      payments.forEach((payment, index) => {
        console.log(`${index + 1}. Payment ID: ${payment._id}`);
        console.log(`   Amount: ${payment.amount}`);
        console.log(`   Status: ${payment.status}`);
        console.log(`   Payment Method: ${payment.paymentMethod}`);
        console.log(`   Booking ID: ${payment.booking}`);
        console.log(`   Transaction ID: ${payment.transactionId}`);
        console.log(`   Payment Date: ${payment.paymentDate}`);
        console.log('---');
      });
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBookingsAndCreatePayments();
