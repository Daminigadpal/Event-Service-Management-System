const mongoose = require('mongoose');

async function getPaymentIds() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('Connected to MongoDB');
    
    const Payment = mongoose.connection.db.collection('payments');
    const payments = await Payment.find({}).toArray();
    
    console.log('=== PAYMENT IDs AND DETAILS ===');
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

getPaymentIds();
