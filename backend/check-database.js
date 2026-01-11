// Direct database connection test
const mongoose = require('mongoose');

async function checkDatabase() {
  console.log('🔍 Testing MongoDB connection...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB Connected Successfully');
    
    // Check if database exists
    const db = mongoose.connection.db;
    console.log('📊 Database name:', db.databaseName);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check users collection specifically
    const User = require('./src/models/User.js');
    console.log('\n👥 Testing User model...');
    
    // Count existing users
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
    // List all users
    const users = await User.find({});
    console.log('👥 All users:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Test creating a user
    console.log('\n🧪 Testing user creation...');
    const testUser = {
      name: 'Test User',
      email: 'test@database.com',
      password: 'test123',
      role: 'user',
      department: 'Testing',
      skills: ['Database Test']
    };
    
    const createdUser = await User.create(testUser);
    console.log('✅ User created successfully:', createdUser.email);
    console.log('🆔 User ID:', createdUser._id);
    
    // Verify user was saved
    const foundUser = await User.findById(createdUser._id);
    if (foundUser) {
      console.log('✅ User verified in database!');
    } else {
      console.log('❌ User NOT found in database!');
    }
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('📋 Registration should work now!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkDatabase();
