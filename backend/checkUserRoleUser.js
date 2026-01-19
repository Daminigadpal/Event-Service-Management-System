const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find a user with 'user' role
    const user = await User.findOne({ role: 'user' }).select('+password');
    if (user) {
      console.log('User found:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password);
      console.log('Password length:', user.password.length);
      
      // Test common passwords
      const bcrypt = require('bcryptjs');
      const commonPasswords = ['user123', 'password', '123456', 'user'];
      
      for (const pwd of commonPasswords) {
        const match = await bcrypt.compare(pwd, user.password);
        if (match) {
          console.log('✅ CORRECT PASSWORD:', pwd);
          break;
        }
      }
    } else {
      console.log('User with role "user" not found');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
