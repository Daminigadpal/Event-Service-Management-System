// Test login with the created users
const testLogin = async () => {
  try {
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
    
    console.log('📡 Response Status:', response.status);
    const data = await response.json();
    console.log('📄 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testLogin();
