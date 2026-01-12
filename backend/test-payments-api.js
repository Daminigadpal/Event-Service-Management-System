// Test the payments API
const testPaymentsAPI = async () => {
  try {
    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // Test payments endpoint with auth
    const paymentsResponse = await fetch('http://localhost:5000/api/v1/payments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('📡 Payments response:', paymentsResponse.status);
    const paymentsData = await paymentsResponse.json();
    console.log('📊 Payments data:', paymentsData);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testPaymentsAPI();
