// Test booking creation API
const testBookingCreation = async () => {
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
    
    // Test booking creation with the same data the frontend is sending
    const bookingData = {
      service: '696084c33d7a9dace9f7c48b',
      eventType: 'wedding',
      eventDate: '2026-01-08',
      eventLocation: 'goa',
      guestCount: 2,
      specialRequests: 'test booking'
    };
    
    console.log('📡 Creating booking with data:', bookingData);
    
    const bookingResponse = await fetch('http://localhost:5000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('📡 Booking creation response:', bookingResponse.status);
    const bookingResult = await bookingResponse.json();
    console.log('📄 Booking result:', bookingResult);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testBookingCreation();
