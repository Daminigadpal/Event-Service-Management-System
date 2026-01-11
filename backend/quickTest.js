// Quick test to verify everything is working
console.log('🚀 Starting quick test...');

const http = require('http');

// Test if backend is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('✅ Backend server is running!');
  console.log('📡 Status:', res.statusCode);
  
  if (res.statusCode === 200) {
    console.log('🎉 Backend is accessible and ready for requests!');
    console.log('\n📋 Now you can:');
    console.log('1. Start the backend: npm start');
    console.log('2. Go to: http://localhost:5173/register');
    console.log('3. Register a new user');
    console.log('4. Check backend console for detailed logs');
  }
});

req.on('error', (err) => {
  console.log('❌ Backend server is NOT running');
  console.log('🔧 Please start the backend with: npm start');
});

req.end();
