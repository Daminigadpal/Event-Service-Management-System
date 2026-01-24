require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event-management')
  .then(async () => {
    console.log('Connected to database');
    const users = await User.find({}).select('-password');
    console.log('\n📋 Available User Accounts:');
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Department: ${user.department}`);
      console.log(`   Skills: ${user.skills.join(', ')}`);
    });
    
    console.log('\n🔑 Login Credentials:');
    console.log('Staff Login:');
    console.log('  Email: staff@test.com');
    console.log('  Password: password123');
    console.log('\nCustomer Login:');
    console.log('  Email: customer@test.com');
    console.log('  Password: password123');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
