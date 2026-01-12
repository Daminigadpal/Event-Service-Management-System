const axios = require('axios');

async function testLogin(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email,
      password
    });
    console.log('Login successful for', email);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed for', email);
    console.log('Error:', error.response?.status, error.response?.data);
  }
}

testLogin('staff@gmail.com', 'staff123');
testLogin('sejal@gmail.com', 'password'); // assume
testLogin('jeet@gmail.com', 'password'); // assume