require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.js');
const Booking = require('./src/models/Booking.js');
const Service = require('./src/models/Service.js');

// Simulate the exact API call
async function testStaffBookingsAPI() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-management');
    console.log('Connected to MongoDB');

    // Step 1: Find staff user (simulate authentication)
    const staff = await User.findOne({ email: 'staff@test.com' });
    if (!staff) {
      console.log('❌ Staff user not found');
      return;
    }
    console.log('✅ Found staff user:', staff.name, 'ID:', staff._id);

    // Step 2: Simulate the getBookings controller logic for staff
    console.log('\n🔍 Simulating API call for staff bookings...');
    
    const bookings = await Booking.find({ staffAssigned: staff._id })
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration')
      .sort({ eventDate: 1 });

    console.log('📊 Raw bookings from database:', bookings.length);

    // Step 3: Format response like the API would
    const apiResponse = {
      success: true,
      data: bookings,
      count: bookings.length
    };

    console.log('\n📡 API Response structure:');
    console.log('Success:', apiResponse.success);
    console.log('Count:', apiResponse.count);
    console.log('Data type:', typeof apiResponse.data);
    console.log('Is array:', Array.isArray(apiResponse.data));

    // Step 4: Show what the frontend would receive
    console.log('\n🔄 What frontend receives:');
    if (apiResponse.data && apiResponse.data.length > 0) {
      apiResponse.data.forEach((booking, index) => {
        console.log(`\nBooking ${index + 1}:`);
        console.log('  _id:', booking._id);
        console.log('  customer:', booking.customer);
        console.log('  service:', booking.service);
        console.log('  eventType:', booking.eventType);
        console.log('  status:', booking.status);
        console.log('  eventDate:', booking.eventDate);
        console.log('  eventLocation:', booking.eventLocation);
        console.log('  quotedPrice:', booking.quotedPrice);
        console.log('  paymentStatus:', booking.paymentStatus);
        console.log('  specialRequests:', booking.specialRequests);
      });
    } else {
      console.log('❌ No bookings found in response data');
    }

    // Step 5: Test the transformation logic
    console.log('\n🔄 Testing frontend transformation...');
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

      console.log('✅ Transformed bookings:', transformedBookings.length);
      transformedBookings.forEach((booking, index) => {
        console.log(`\nTransformed ${index + 1}:`);
        console.log('  id:', booking.id);
        console.log('  customerName:', booking.customerName);
        console.log('  eventName:', booking.eventName);
        console.log('  date:', booking.date);
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

testStaffBookingsAPI();
