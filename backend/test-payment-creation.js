// Test payment creation to see what's causing the 400 error
const testPaymentCreation = async () => {
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
    
    // Test payment creation with minimum required fields
    const paymentData = {
      booking: '6963ca223dd7e0874c316d24', // Latest booking ID
      user: loginData.data.id, // Admin user ID
      paymentType: 'full',
      amount: 5000,
      paymentMethod: 'credit_card',
      notes: 'Test payment creation'
    };
    
    console.log('📡 Creating payment with data:', paymentData);
    
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
    } else {
      console.log('❌ Payment creation failed:', paymentResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testPaymentCreation();
