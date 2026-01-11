console.log('🔧 Testing MongoDB connection...');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Test creating a user
    const User = require('./src/models/User.js');
    
    User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'user',
      department: 'General',
      skills: [],
      phone: '',
      address: ''
    })
    .then(user => {
      console.log('✅ User created:', user.email);
      console.log('✅ User ID:', user._id);
      
      // Find the user
      return User.findOne({ email: 'test@example.com' });
    })
    .then(foundUser => {
      console.log('✅ User found in database:', foundUser ? 'Yes' : 'No');
      
      // Count all users
      return User.countDocuments();
    })
    .then(count => {
      console.log('✅ Total users in database:', count);
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
