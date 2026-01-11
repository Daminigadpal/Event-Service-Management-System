const mongoose = require('mongoose');
const User = require('./src/models/User.js');

async function testRegistration() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB connected successfully');

    // Clear existing users for testing
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Test creating a user
    console.log('👤 Creating test user...');
    const testUser = await User.create({
      name: 'Jeet',
      email: 'jeet@gmail.com',
      password: 'jeet1234',
      role: 'user',
      department: 'General',
      skills: [],
      phone: '',
      address: ''
    });
    
    console.log('✅ User created successfully:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      department: testUser.department
    });

    // Test finding the user
    const foundUser = await User.findOne({ email: 'jeet@gmail.com' }).select('+password');
    console.log('✅ User found in database:', foundUser ? 'Yes' : 'No');

    // Test password matching
    const isMatch = await foundUser.matchPassword('jeet1234');
    console.log('✅ Password matching works:', isMatch ? 'Yes' : 'No');

    // Show all users
    const allUsers = await User.find({});
    console.log('✅ Total users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} - ${user.department}`);
    });

    console.log('🎉 Registration test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testRegistration();
