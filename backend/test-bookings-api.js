// Test the bookings API
const testBookingsAPI = async () => {
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
    
    // Test public bookings endpoint (no auth required)
    const publicResponse = await fetch('http://localhost:5000/api/v1/public-bookings');
    console.log('📡 Public bookings response:', publicResponse.status);
    const publicData = await publicResponse.json();
    console.log('📊 Public bookings data:', publicData);
    
    // Test protected bookings endpoint with auth
    const protectedResponse = await fetch('http://localhost:5000/api/v1/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('📡 Protected bookings response:', protectedResponse.status);
    const protectedData = await protectedResponse.json();
    console.log('📊 Protected bookings data:', protectedData);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testBookingsAPI();
