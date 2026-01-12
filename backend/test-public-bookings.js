// Test the new public bookings endpoint
const testPublicBookingsEndpoint = async () => {
  console.log('🔍 Testing /api/v1/public-bookings endpoint (unprotected)...');
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/public-bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('📄 Raw Response:', text);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Parsed JSON response:', data);
        if (data.success && data.data) {
          console.log('📊 Bookings found:', data.data.length);
          data.data.forEach((booking, index) => {
            console.log(`  ${index + 1}. ${booking.eventType} - ${booking.eventLocation} (${booking.status})`);
          });
          return true;
        } else {
          console.log('❌ JSON response indicates failure:', data);
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
    
    return false;
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
};

testPublicBookingsEndpoint().then(success => {
  if (success) {
    console.log('✅ Public bookings API endpoint is working - frontend should be able to fetch all bookings');
  } else {
    console.log('❌ Public bookings API endpoint has issues');
  }
});
