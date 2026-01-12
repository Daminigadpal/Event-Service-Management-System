// Debug the login process
const debugLogin = async () => {
  try {
    // Test with different password
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
    
    // Let's also check what's in the database
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/event_management');
    const User = require('./src/models/User.js');
    
    const user = await User.findOne({ email: 'sejal@gmail.com' }).select('+password');
    console.log('🔍 User from DB:', {
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: user.password ? user.password.substring(0, 20) + '...' : 'No password'
    });
    
    // Test password comparison
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('🔐 Password match test:', isMatch);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

debugLogin();
