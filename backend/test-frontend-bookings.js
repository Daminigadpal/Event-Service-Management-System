// Test what the frontend is actually receiving
const testFrontendBookings = async () => {
  try {
    console.log('🔍 Testing frontend bookings API...');
    
    // Test the exact same API call the frontend makes
    const response = await fetch('http://localhost:5000/api/v1/public-bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Frontend bookings API response:', response.status);
    const data = await response.json();
    console.log('📊 Frontend bookings data:', data);
    
    // Check if the data structure matches what the frontend expects
    if (data.success && data.data) {
      console.log('✅ Success:', data.success);
      console.log('📊 Count:', data.count);
      console.log('📋 Bookings:', data.data.map(b => ({
        id: b.id,
        event: b.eventType,
        location: b.eventLocation,
        status: b.status,
        customer: b.customer?.name || 'No customer'
      })));
    } else {
      console.log('❌ API response indicates failure:', data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testFrontendBookings();
