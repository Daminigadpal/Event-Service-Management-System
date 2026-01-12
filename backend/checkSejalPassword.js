const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'sejal@gmail.com' }).select('+password');
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash:', user.password);
      console.log('Password length:', user.password.length);
      
      // Test different passwords
      const bcrypt = require('bcryptjs');
      const passwords = ['admin123', 'sejal123', 'password', '123456'];
      
      for (const pwd of passwords) {
        const match = await bcrypt.compare(pwd, user.password);
        console.log(`Password match for '${pwd}':`, match);
        if (match) {
          console.log(`✅ CORRECT PASSWORD: ${pwd}`);
          break;
        }
      }
    } else {
      console.log('User not found');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
