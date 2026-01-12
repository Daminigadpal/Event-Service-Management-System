const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Create the om@gamil.com user
    const bcrypt = require('bcryptjs');
    
    const omUser = {
      name: 'Anuj',
      email: 'om@gamil.com',
      role: 'staff',
      department: 'Operations',
      password: await bcrypt.hash('staff123', 10)
    };
    
    try {
      await User.create(omUser);
      console.log('✅ User om@gamil.com created successfully');
      console.log('🔑 Password: staff123');
    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ User om@gamil.com already exists');
      } else {
        console.error('❌ Error creating user:', error);
      }
    }
    
    // Test the login
    const testUser = await User.findOne({ email: 'om@gamil.com' }).select('+password');
    if (testUser) {
      const match = await bcrypt.compare('staff123', testUser.password);
      console.log('🔐 Password match test:', match ? '✅ Success' : '❌ Failed');
    }
    
    // List all users
    const users = await User.find({}).select('name email role');
    console.log('\n📋 All users in database:');
    users.forEach(user => {
      console.log(`  ${user.name} - ${user.email} - ${user.role}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
