const mongoose = require('mongoose');
const User = require('./src/models/User.js');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Delete and recreate the user with proper password
    await User.deleteOne({ email: 'om@gamil.com' });
    
    const hashedPassword = await bcrypt.hash('staff123', 10);
    console.log('🔐 Generated hash:', hashedPassword);
    
    // Test the hash
    const testMatch = await bcrypt.compare('staff123', hashedPassword);
    console.log('🔐 Hash test:', testMatch ? '✅ Success' : '❌ Failed');
    
    // Create user with pre-hashed password
    const omUser = new User({
      name: 'Anuj',
      email: 'om@gamil.com',
      role: 'staff',
      department: 'Operations',
      password: hashedPassword
    });
    
    // Save without triggering the pre-save hook
    await omUser.save({ validateBeforeSave: false });
    console.log('✅ User om@gamil.com created with pre-hashed password');
    
    // Test login
    const testResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'om@gamil.com',
        password: 'staff123'
      })
    });
    
    console.log('📡 Login test status:', testResponse.status);
    const testData = await testResponse.json();
    console.log('📄 Login response:', testData);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
