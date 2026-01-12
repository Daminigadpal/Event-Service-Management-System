// Test login for om@gamil.com user
const testOmLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'om@gamil.com',
        password: 'staff123'
      })
    });
    
    console.log('📡 Login test for om@gamil.com:');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User role:', data.data.role);
    } else {
      console.log('❌ Login failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testOmLogin();
