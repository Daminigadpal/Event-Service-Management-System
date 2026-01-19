const axios = require('axios');

async function createTestData() {
  try {
    console.log('Creating test event preference...');
    
    // First login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'sejal@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Token received:', token);
    
    // Create a test event preference
    const preferenceData = {
      eventType: 'wedding',
      preferredVenue: 'Garden Venue',
      budgetRange: '5000-10000',
      guestCount: '100-200',
      notes: 'Test event preference created via API'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/v1/event-preferences', 
      preferenceData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Created preference:', createResponse.data);
    
    // Now test getting all preferences
    const getAllResponse = await axios.get('http://localhost:5000/api/v1/event-preferences/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('All preferences:', getAllResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createTestData();
