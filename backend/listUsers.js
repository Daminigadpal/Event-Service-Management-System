const mongoose = require('mongoose');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('name email role');
    console.log('Users in DB:');
    users.forEach(user => {
      console.log(`${user.name} - ${user.email} - ${user.role}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });