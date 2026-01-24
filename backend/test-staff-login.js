require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./src/models/User.js');

async function testLoginAndGetToken() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-management');
    console.log('Connected to MongoDB');

    // Find staff user with password
    const staff = await User.findOne({ email: 'staff@test.com' }).select('+password');
    if (!staff) {
      console.log('❌ Staff user not found');
      return;
    }

    // Test password match
    const isMatch = await staff.matchPassword('password123');
    if (!isMatch) {
      console.log('❌ Password does not match');
      return;
    }

    // Generate token like the login API would
    const token = jwt.sign(
      { id: staff._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ Staff login successful!');
    console.log('📧 Email:', staff.email);
    console.log('👤 Name:', staff.name);
    console.log('🔑 Role:', staff.role);
    console.log('🎫 Token:', token.substring(0, 50) + '...');
    
    console.log('\n📋 Use these credentials to login in the frontend:');
    console.log('Email: staff@test.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLoginAndGetToken();
