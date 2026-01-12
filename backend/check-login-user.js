const mongoose = require('mongoose');
const User = require('./src/models/User.js');

// Check if user exists in database
const checkUser = async () => {
  try {
    console.log('🔍 Checking user login credentials...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ Connected to MongoDB');
    
    // Find user by email
    const user = await User.findOne({ email: 'sai@gmail.com' }).select('+password');
    
    if (user) {
      console.log('✅ User found in database:');
      console.log('  ID:', user._id);
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Password exists:', user.password ? 'Yes' : 'No');
      console.log('  Password hash length:', user.password ? user.password.length : 0);
      
      // Test password match
      const isMatch = await user.matchPassword('sai123');
      console.log('🔑 Password match result:', isMatch ? 'Success' : 'Failed');
      
    } else {
      console.log('❌ User NOT found in database');
      console.log('📋 Available users:');
      const allUsers = await User.find({});
      allUsers.forEach((u, index) => {
        console.log(`  ${index + 1}. Email: ${u.email}, Name: ${u.name}, Role: ${u.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Disconnected from MongoDB');
  }
};

checkUser();
