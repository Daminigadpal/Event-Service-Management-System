const http = require('http');

// Test event preference API
async function testEventPreferenceAPI() {
  try {
    // First login to get token
    console.log('Logging in...');
    const loginData = JSON.stringify({
      email: 'staff@gmail.com',
      password: 'staff123'
    });

    const loginResponse = await makeRequest('POST', '/api/v1/auth/login', loginData);
    const loginResult = JSON.parse(loginResponse);
    const token = loginResult.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');

    // Test creating event preference
    console.log('Creating event preference...');
    const preferenceData = JSON.stringify({
      eventType: 'wedding',
      preferredVenue: 'Grand Ballroom',
      budgetRange: {
        min: 1000,
        max: 3000
      },
      guestCount: 50,
      notes: 'Test preference via API'
    });

    const createResponse = await makeRequest('POST', '/api/v1/event-preferences', preferenceData, token);
    const createResult = JSON.parse(createResponse);

    console.log('✅ Event preference created via API:');
    console.log(createResult);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function makeRequest(method, path, data, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(`HTTP ${res.statusCode}: ${body}`);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

testEventPreferenceAPI();