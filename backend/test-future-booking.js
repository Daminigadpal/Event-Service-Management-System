// Test booking creation with future date
const testFutureBooking = async () => {
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
    
    // Test booking creation with future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
    const dateString = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const bookingData = {
      service: '696084c33d7a9dace9f7c48b',
      eventType: 'wedding',
      eventDate: dateString,
      eventLocation: 'goa',
      guestCount: 2,
      specialRequests: 'test booking with future date'
    };
    
    console.log('📡 Creating booking with future date:', dateString);
    console.log('📡 Booking data:', bookingData);
    
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
    
    if (bookingResponse.ok) {
      console.log('✅ Booking created successfully!');
    } else {
      console.log('❌ Booking creation failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testFutureBooking();
