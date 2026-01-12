// Debug what the backend is actually receiving
const testBackendLogin = async () => {
  try {
    // Test the exact same request the frontend is sending
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
    
    console.log('📡 Backend login test:');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    // Let's also test with a different password to see the difference
    const response2 = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: 'wrongpassword'
      })
    });
    
    console.log('\n📡 Wrong password test:');
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', data2);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testBackendLogin();
