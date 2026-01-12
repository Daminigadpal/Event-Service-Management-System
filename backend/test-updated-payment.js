// Test payment creation with the updated frontend data structure
const testUpdatedPayment = async () => {
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
    
    // Test payment creation with the exact data structure the frontend now sends
    const paymentData = {
      booking: '6963ca223dd7e0874c316d24', // Latest booking ID
      user: loginData.data.id, // Admin user ID
      paymentType: 'advance',
      amount: 5000,
      paymentMethod: 'credit_card',
      transactionId: 'TXN123456',
      notes: 'Test payment from updated frontend'
    };
    
    console.log('📡 Creating payment with updated frontend data:', paymentData);
    
    const paymentResponse = await fetch('http://localhost:5000/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    console.log('📡 Payment creation response:', paymentResponse.status);
    const paymentResult = await paymentResponse.json();
    console.log('📄 Payment result:', paymentResult);
    
    if (paymentResponse.ok) {
      console.log('✅ Payment created successfully!');
      console.log('🎉 Frontend payment creation should now work!');
    } else {
      console.log('❌ Payment creation failed:', paymentResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testUpdatedPayment();
