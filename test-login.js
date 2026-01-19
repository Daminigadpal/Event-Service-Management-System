const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing staff login...');
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'staff@gmail.com',
      password: 'staff123'
    });
    
    console.log('✅ Login successful!');
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
