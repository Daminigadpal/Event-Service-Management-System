const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Check for om@gamil.com user
    const omUser = await User.findOne({ email: 'om@gamil.com' }).select('+password');
    if (omUser) {
      console.log('User om@gamil.com found:', omUser.email);
      console.log('Password hash:', omUser.password);
      
      // Test different passwords
      const bcrypt = require('bcryptjs');
      const passwords = ['staff123', 'om123', 'password', '123456'];
      
      for (const pwd of passwords) {
        const match = await bcrypt.compare(pwd, omUser.password);
        console.log(`Password match for '${pwd}':`, match);
        if (match) {
          console.log(`✅ CORRECT PASSWORD: ${pwd}`);
          break;
        }
      }
    } else {
      console.log('❌ User om@gamil.com not found in database');
      
      // List all users to show available options
      const users = await User.find({}).select('name email role');
      console.log('\n📋 Available users in database:');
      users.forEach(user => {
        console.log(`  ${user.name} - ${user.email} - ${user.role}`);
      });
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
