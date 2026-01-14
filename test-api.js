const axios = require('axios');

async function testEventPreferences() {
  try {
    console.log('Testing Event Preferences API...');
    
    // Test the base route first
    console.log('\n1. Testing base route:');
    try {
      const response1 = await axios.get('http://localhost:5000/api/v1/event-preferences');
      console.log('Response:', response1.data);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Test the /all route
    console.log('\n2. Testing /all route:');
    try {
      const response2 = await axios.get('http://localhost:5000/api/v1/event-preferences/all');
      console.log('Response:', response2.data);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEventPreferences();
