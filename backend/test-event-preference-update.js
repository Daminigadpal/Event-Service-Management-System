// Test event preference update functionality
const testEventPreferenceUpdate = async () => {
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
    
    // Test event preference update
    const preferenceData = {
      eventType: 'wedding',
      preferredVenue: 'Grand Ballroom',
      budgetRange: '10000-20000',
      guestCount: '150',
      notes: 'Updated preference test'
    };
    
    console.log('📡 Updating event preference with data:', preferenceData);
    
    const updateResponse = await fetch('http://localhost:5000/api/v1/event-preferences', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceData)
    });
    
    console.log('📡 Update response:', updateResponse.status);
    const updateResult = await updateResponse.json();
    console.log('📄 Update result:', updateResult);
    
    if (updateResponse.ok) {
      console.log('✅ Event preference updated successfully!');
    } else {
      console.log('❌ Event preference update failed:', updateResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testEventPreferenceUpdate();
