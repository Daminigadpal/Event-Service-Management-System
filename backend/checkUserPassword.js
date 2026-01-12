const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'staff@gmail.com' }).select('+password');
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash:', user.password);
      console.log('Password length:', user.password.length);
      // Test match
      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare('staff123', user.password);
      console.log('Password match for staff123:', match);
    } else {
      console.log('User not found');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });