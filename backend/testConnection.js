const mongoose = require('mongoose');
const User = require('./src/models/User.js');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB connected successfully');

    // Test creating a user
    console.log('Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'user',
      department: 'General',
      skills: [],
      phone: '',
      address: ''
    });
    
    console.log('✅ User created:', testUser);

    // Test finding the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✅ User found:', foundUser ? 'Yes' : 'No');

    // Show all users
    const allUsers = await User.find({});
    console.log('✅ Total users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
