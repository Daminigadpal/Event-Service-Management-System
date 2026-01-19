const axios = require('axios');

async function testAllLogins() {
  const users = [
    { email: 'staff@gmail.com', password: 'staff123', role: 'staff' },
    { email: 'sejal@gmail.com', password: 'admin123', role: 'admin' },
    { email: 'jeet@gmail.com', password: 'user123', role: 'user' }
  ];

  for (const user of users) {
    try {
      console.log(`\n🧪 Testing ${user.role} login (${user.email})...`);
      
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: user.email,
        password: user.password
      });
      
      console.log(`✅ ${user.role} login successful!`);
      console.log(`👤 Name: ${response.data.data.name}`);
      console.log(`🎭 Role: ${response.data.data.role}`);
      console.log(`📧 Email: ${response.data.data.email}`);
      
    } catch (error) {
      console.log(`❌ ${user.role} login failed:`);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }
  }
}

testAllLogins();
