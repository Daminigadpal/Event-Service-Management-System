const http = require('http');

const userData = JSON.stringify({
  name: 'Reene',
  email: 'reene@gmail.com',
  password: 'password123',
  role: 'user'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(userData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Registration response:', data);
  });
});

req.on('error', (e) => {
  console.error('Registration error:', e.message);
});

req.write(userData);
req.end();
