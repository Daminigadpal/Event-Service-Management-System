// Test the actual API endpoint with authentication
const axios = require('axios');

async function testRealAPIEndpoint() {
  try {
    console.log('🔍 Testing real API endpoint...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'staff@test.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.token ? 'Received' : 'Not received');
    console.log('User data:', loginResponse.data.data ? 'Received' : 'Not received');

    const token = loginResponse.data.token;

    // Now test the bookings endpoint with authentication
    console.log('\n📡 Testing /api/v1/bookings endpoint...');
    
    const bookingsResponse = await axios.get('http://localhost:5000/api/v1/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Bookings API call successful');
    console.log('Response success:', bookingsResponse.data.success);
    console.log('Response count:', bookingsResponse.data.count);
    console.log('Data array length:', bookingsResponse.data.data ? bookingsResponse.data.data.length : 'null');

    if (bookingsResponse.data.data && bookingsResponse.data.data.length > 0) {
      console.log('\n📋 Bookings received:');
      bookingsResponse.data.data.forEach((booking, index) => {
        console.log(`\nBooking ${index + 1}:`);
        console.log('  _id:', booking._id);
        console.log('  customer:', booking.customer?.name);
        console.log('  service:', booking.service?.name);
        console.log('  eventType:', booking.eventType);
        console.log('  status:', booking.status);
        console.log('  quotedPrice:', booking.quotedPrice);
      });
    } else {
      console.log('❌ No bookings received');
    }

  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', error.response.data);
    }
  }
}

testRealAPIEndpoint();
