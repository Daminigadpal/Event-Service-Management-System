const mongoose = require('mongoose');
const Payment = require('./src/models/Payment.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const payments = await Payment.find({})
      .populate('booking', 'eventType eventLocation guestCount')
      .populate('customer', 'name email');
    
    console.log('Payments/Invoices in DB:', payments.length);
    payments.forEach((payment, index) => {
      console.log(`${index + 1}. ${payment.invoiceNumber || 'No Invoice'} - ${payment.booking?.eventType || 'No Booking'} - ${payment.status}`);
      console.log(`   Customer: ${payment.customer?.name || 'None'} (${payment.customer?.email || 'None'})`);
      console.log(`   Amount: $${payment.amount || 0}`);
      console.log(`   Status: ${payment.status}`);
      console.log(`   Date: ${payment.createdAt}`);
      console.log('');
    });

    if (payments.length === 0) {
      console.log('❌ No invoices found in database');
      console.log('📝 Creating sample invoices...');
      
      // Get existing bookings and users
      const Booking = require('./src/models/Booking.js');
      const User = require('./src/models/User.js');
      
      const bookings = await Booking.find({});
      const adminUser = await User.findOne({ email: 'sejal@gmail.com' });
      
      if (bookings.length > 0) {
        const sampleInvoices = [
          {
            booking: bookings[0]._id,
            customer: bookings[0].customer,
            user: adminUser._id,
            paymentType: 'full',
            amount: 15000,
            paymentMethod: 'credit_card',
            status: 'paid',
            paymentDate: new Date(),
            notes: 'Wedding planning - Payment received via credit card',
            receiptNumber: 'REC-2026-001'
          },
          {
            booking: bookings[1]._id,
            customer: bookings[1].customer,
            user: adminUser._id,
            paymentType: 'advance',
            amount: 4000,
            paymentMethod: 'bank_transfer',
            status: 'pending',
            notes: 'Birthday party - Advance payment pending',
            receiptNumber: 'REC-2026-002'
          },
          {
            booking: bookings[2]._id,
            customer: bookings[2].customer,
            user: adminUser._id,
            paymentType: 'balance',
            amount: 3000,
            paymentMethod: 'cash',
            status: 'failed',
            notes: 'Corporate event - Payment failed, please retry',
            receiptNumber: 'REC-2026-003'
          }
        ];
        
        await Payment.insertMany(sampleInvoices);
        console.log('✅ Sample invoices created successfully');
      }
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
