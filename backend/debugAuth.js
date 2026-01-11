// Debug script to test auth flow
const mongoose = require('mongoose');
const User = require('./src/models/User.js');

async function debugAuth() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB connected');

    // Step 1: Check if users exist
    console.log('\n📋 Checking existing users...');
    const existingUsers = await User.find({});
    console.log(`Found ${existingUsers.length} users:`);
    existingUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Step 2: Try to create a test user
    console.log('\n👤 Creating test user...');
    const testUser = {
      name: 'Debug User',
      email: 'debug@test.com',
      password: 'debug123',
      role: 'user',
      department: 'General',
      skills: [],
      phone: '',
      address: ''
    };
    
    console.log('User data to create:', testUser);
    
    const createdUser = await User.create(testUser);
    console.log('✅ User created successfully:');
    console.log('  ID:', createdUser._id);
    console.log('  Email:', createdUser.email);
    console.log('  Password (hashed):', createdUser.password ? 'Hashed' : 'Missing');

    // Step 3: Test finding the user
    console.log('\n🔍 Testing user lookup...');
    const foundUser = await User.findOne({ email: 'debug@test.com' });
    console.log('User found:', foundUser ? 'Yes' : 'No');
    
    if (foundUser) {
      console.log('Found user details:');
      console.log('  Name:', foundUser.name);
      console.log('  Email:', foundUser.email);
      console.log('  Role:', foundUser.role);
      console.log('  Password exists:', foundUser.password ? 'Yes' : 'No');
      
      // Step 4: Test password matching
      console.log('\n🔐 Testing password matching...');
      const isMatch = await foundUser.matchPassword('debug123');
      console.log('Password match result:', isMatch);
      
      // Step 5: Test wrong password
      const isWrongMatch = await foundUser.matchPassword('wrongpassword');
      console.log('Wrong password match result:', isWrongMatch);
    }

    console.log('\n🎉 Debug completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Debug error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

debugAuth();
