// Test what the frontend is actually receiving for bookings
const testBookingsFrontend = async () => {
  try {
    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // Test public bookings endpoint (what admin should see)
    const publicResponse = await fetch('http://localhost:5000/api/v1/public-bookings');
    console.log('📡 Public bookings response:', publicResponse.status);
    const publicData = await publicResponse.json();
    console.log('📊 Public bookings count:', publicData.data?.length);
    
    // Test protected bookings endpoint with admin token
    const protectedResponse = await fetch('http://localhost:5000/api/v1/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('📡 Protected bookings response:', protectedResponse.status);
    const protectedData = await protectedResponse.json();
    console.log('📊 Protected bookings count:', protectedData.data?.length);
    
    // Compare the data
    console.log('\n🔍 Data Comparison:');
    console.log('Public bookings:', publicData.data?.map(b => ({ id: b.id, event: b.eventType, location: b.eventLocation })));
    console.log('Protected bookings:', protectedData.data?.map(b => ({ id: b.id, event: b.eventType, location: b.eventLocation })));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testBookingsFrontend();
