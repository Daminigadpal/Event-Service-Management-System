// Test the exact same API call that the frontend bookingService makes
const axios = require('axios');

async function testFrontendAPICall() {
  try {
    console.log('🔍 Testing frontend API call pattern...');
    
    // First, login to get a token (same as frontend)
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'staff@test.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = loginResponse.data.token;
    console.log('✅ Got token:', token.substring(0, 50) + '...');

    // Create axios instance exactly like the frontend does
    const api = axios.create({
      baseURL: 'http://localhost:5000/api/v1', // Direct connection to backend
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      timeout: 10000,
      withCredentials: true
    });

    // Add authorization header like frontend does
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('📞 Making API call to /bookings...');
    
    // Make the exact same call as frontend bookingService.getBookings()
    const response = await api.get('/bookings');
    
    console.log('📊 Frontend-style API Response:');
    console.log('Response data:', response.data);
    console.log('Success:', response.data.success);
    console.log('Count:', response.data.count);
    console.log('Data type:', typeof response.data.data);
    console.log('Is array:', Array.isArray(response.data.data));
    console.log('Data length:', response.data.data ? response.data.data.length : 'null');

    // Test the exact transformation logic from frontend
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log('\n🔄 Testing frontend transformation...');
      const transformedBookings = response.data.data.map(booking => ({
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
        console.log('  customerName:', booking.customerName);
        console.log('  eventName:', booking.eventName);
        console.log('  status:', booking.status);
        console.log('  amount:', booking.amount);
      });
    }

  } catch (error) {
    console.error('❌ Frontend API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testFrontendAPICall();
