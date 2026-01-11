// Verify server is working
const http = require('http');

console.log('🔍 Testing server connection...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Server is responding on port 5000!');
      console.log('📡 Response:', data.trim());
    } else {
      console.log('❌ Server not responding - Status:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Connection error:', err.message);
});

req.end();
