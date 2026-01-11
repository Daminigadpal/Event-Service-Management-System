// Manual test script - run this directly with: node testManual.js
const mongoose = require('mongoose');
const User = require('./src/models/User.js');

async function testRegistration() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB connected successfully');

    // Clear existing test users
    await User.deleteMany({ email: { $in: ['test@example.com', 'jeet@gmail.com'] } });
    console.log('🗑️ Cleared existing test users');

    // Test 1: Create a simple user
    console.log('\n👤 Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'user'
    });
    console.log('✅ User created:', testUser.email, 'ID:', testUser._id);

    // Test 2: Create Jeet user
    console.log('\n👤 Creating Jeet user...');
    const jeetUser = await User.create({
      name: 'Jeet',
      email: 'jeet@gmail.com',
      password: 'jeet1234',
      role: 'user',
      department: 'General',
      skills: ['Testing'],
      phone: '1234567890',
      address: 'Test Address'
    });
    console.log('✅ Jeet user created:', jeetUser.email, 'ID:', jeetUser._id);

    // Test 3: Find users
    console.log('\n🔍 Finding users...');
    const allUsers = await User.find({});
    console.log('✅ Total users in database:', allUsers.length);
    
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role} - Dept: ${user.department}`);
    });

    // Test 4: Test password matching
    console.log('\n🔐 Testing password matching...');
    const foundUser = await User.findOne({ email: 'jeet@gmail.com' });
    if (foundUser) {
      const isMatch = await foundUser.matchPassword('jeet1234');
      console.log('✅ Password matching works:', isMatch ? 'Yes' : 'No');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 You can now try to login with:');
    console.log('   - Email: test@example.com, Password: test123');
    console.log('   - Email: jeet@gmail.com, Password: jeet1234');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testRegistration();
