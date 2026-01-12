const mongoose = require('mongoose');
const User = require('./src/models/User.js');

// Test the users API endpoint
const testUsersAPI = async () => {
  try {
    console.log('🔍 Testing /api/v1/users endpoint...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ Connected to MongoDB');
    
    // Test the getUsers function directly
    const users = await User.find({}).select('-password');
    console.log('📊 Found users in database:', users.length);
    
    if (users.length > 0) {
      console.log('👥 Users found:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    } else {
      console.log('❌ No users found in database');
    }
    
    // Test API endpoint with fetch
    console.log('\n🌐 Testing API endpoint...');
    const response = await fetch('http://localhost:5000/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-admin-token'
      }
    });
    
    const data = await response.json();
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Data:', data);
    
    if (data.success) {
      console.log('✅ API endpoint working correctly');
      console.log('📊 Users returned:', data.data?.length || 0);
    } else {
      console.log('❌ API endpoint failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Disconnected from MongoDB');
  }
};

testUsersAPI();
