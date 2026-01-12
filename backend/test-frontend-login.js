// Test what the frontend is actually sending
const testFrontendLogin = async () => {
  try {
    // Test the exact same request the frontend would make
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: 'admin123'
      })
    });
    
    console.log('📡 Frontend-style login test:');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    // Also test with empty password to see what happens
    const response2 = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: ''
      })
    });
    
    console.log('\n📡 Empty password test:');
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', data2);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testFrontendLogin();
