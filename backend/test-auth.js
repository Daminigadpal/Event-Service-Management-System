require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find staff user
    const staff = await User.findOne({ email: 'staff@test.com' }).select('+password');
    if (!staff) {
      console.log('Staff user not found');
      process.exit(1);
    }
    
    console.log('Found staff user:', staff.name);
    console.log('Testing password match...');
    
    // Test password
    const isMatch = await staff.matchPassword('password123');
    console.log('Password match:', isMatch);
    
    if (isMatch) {
      console.log('✅ Staff login should work!');
      const token = staff.getSignedJwtToken();
      console.log('Generated token:', token.substring(0, 50) + '...');
    } else {
      console.log('❌ Password does not match');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
