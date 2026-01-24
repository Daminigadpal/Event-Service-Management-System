require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./src/models/User.js');
const Booking = require('./src/models/Booking.js');
const Service = require('./src/models/Service.js');

async function testActualAPIFlow() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-management');
    console.log('Connected to MongoDB');

    // Step 1: Simulate staff login and get token
    const staff = await User.findOne({ email: 'staff@test.com' }).select('+password');
    if (!staff) {
      console.log('❌ Staff user not found');
      return;
    }

    const token = jwt.sign(
      { id: staff._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ Generated token for staff:', staff.name);

    // Step 2: Simulate the exact getBookings controller logic
    console.log('\n🔍 Testing getBookings controller logic...');
    
    // Simulate req.user.id from the JWT token
    const mockReqUser = { id: staff._id, role: 'staff' };
    
    let bookings;
    if (mockReqUser.role === 'staff') {
      // Staff can see bookings assigned to them
      bookings = await Booking.find({ staffAssigned: mockReqUser.id })
        .populate('customer', 'name email phone')
        .populate('service', 'name description price duration')
        .sort({ eventDate: 1 });
      console.log('📋 Staff bookings query executed');
    } else {
      console.log('❌ Not a staff user');
      return;
    }

    console.log('📊 Found bookings:', bookings.length);

    // Step 3: Format the exact API response
    const apiResponse = {
      success: true,
      data: bookings,
      count: bookings.length
    };

    console.log('\n📡 API Response that frontend should receive:');
    console.log('Success:', apiResponse.success);
    console.log('Count:', apiResponse.count);
    console.log('Data array length:', apiResponse.data ? apiResponse.data.length : 'null');

    // Step 4: Check if bookings have the required fields
    if (apiResponse.data && apiResponse.data.length > 0) {
      console.log('\n🔍 Checking booking fields...');
      apiResponse.data.forEach((booking, index) => {
        console.log(`\nBooking ${index + 1}:`);
        console.log('  _id:', booking._id);
        console.log('  customer.name:', booking.customer?.name);
        console.log('  service.name:', booking.service?.name);
        console.log('  eventType:', booking.eventType);
        console.log('  status:', booking.status);
        console.log('  eventDate:', booking.eventDate);
        console.log('  eventLocation:', booking.eventLocation);
        console.log('  quotedPrice:', booking.quotedPrice);
        console.log('  paymentStatus:', booking.paymentStatus);
        console.log('  specialRequests:', booking.specialRequests);
        console.log('  staffAssigned:', booking.staffAssigned);
      });
    } else {
      console.log('❌ No bookings found or data is null');
    }

    // Step 5: Test the frontend transformation
    console.log('\n🔄 Testing frontend data transformation...');
    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      const transformedBookings = apiResponse.data.map(booking => ({
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
        notes: booking.specialRequests || booking.internalNotes || ''
      }));

      console.log('✅ Transformed bookings for frontend:', transformedBookings.length);
      
      // Calculate stats like frontend
      const completed = transformedBookings.filter(b => b.status === 'completed').length;
      const confirmed = transformedBookings.filter(b => b.status === 'confirmed').length;
      const pending = transformedBookings.filter(b => b.status === 'inquiry' || b.status === 'pending').length;

      console.log('\n📈 Frontend Statistics:');
      console.log('Total:', transformedBookings.length);
      console.log('Completed:', completed);
      console.log('Confirmed:', confirmed);
      console.log('Pending:', pending);

      transformedBookings.forEach((booking, index) => {
        console.log(`\nFinal Booking ${index + 1}:`);
        console.log('  customerName:', booking.customerName);
        console.log('  eventName:', booking.eventName);
        console.log('  status:', booking.status);
        console.log('  amount:', booking.amount);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testActualAPIFlow();
